"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class NoActiveCompanyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoActiveCompanyError";
  }
}

/**
 * Resolve a empresa ativa da sessão. Usa `user.companyId` quando presente;
 * enquanto o vínculo não existir para todos os usuários, cai para a única
 * empresa cadastrada. Nunca aceita um id vindo do cliente.
 */
export async function getActiveCompanyId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new NoActiveCompanyError("Usuário não autenticado.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { companyId: true },
  });

  if (user?.companyId) {
    return user.companyId;
  }

  const companies = await prisma.company.findMany({ select: { id: true }, take: 2 });
  if (companies.length === 1) {
    return companies[0].id;
  }

  throw new NoActiveCompanyError(
    companies.length === 0
      ? "Nenhuma empresa cadastrada. Rode o seed antes de usar o módulo."
      : "Usuário sem empresa vinculada e mais de uma empresa cadastrada — vincule o usuário explicitamente.",
  );
}
