"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActiveCompanyId } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import {
  checklistDraftSchema,
  toFieldErrors,
  type ChecklistDraft,
  type ChecklistDraftFieldErrors,
} from "@/lib/checklists/schema";

export type ChecklistActionResult =
  | { ok: true; id: string }
  | { ok: false; fieldErrors: ChecklistDraftFieldErrors; formError?: string };

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Usuário não autenticado.");
  }
  return session.user.id;
}

function itemsData(draft: ChecklistDraft) {
  return draft.items.map((item, index) => ({
    position: index,
    text: item.text,
    section: item.section || null,
    criticality: item.criticality,
  }));
}

export async function createChecklistTemplate(
  input: unknown,
): Promise<ChecklistActionResult> {
  const parsed = checklistDraftSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed) };
  }

  const [userId, companyId] = await Promise.all([requireUserId(), getActiveCompanyId()]);
  const draft = parsed.data;

  const template = await prisma.checklistTemplate.create({
    data: {
      companyId,
      title: draft.title,
      standard: draft.standard,
      sectorId: draft.sectorId || null,
      createdById: userId,
      items: { create: itemsData(draft) },
    },
    select: { id: true },
  });

  return { ok: true, id: template.id };
}

export async function updateChecklistTemplate(
  id: string,
  input: unknown,
): Promise<ChecklistActionResult> {
  const parsed = checklistDraftSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed) };
  }

  const companyId = await getActiveCompanyId();
  const draft = parsed.data;

  const existing = await prisma.checklistTemplate.findFirst({
    where: { id, companyId },
    select: { id: true },
  });
  if (!existing) {
    return { ok: false, fieldErrors: {}, formError: "Checklist não encontrado." };
  }

  await prisma.$transaction([
    prisma.checklistTemplateItem.deleteMany({ where: { templateId: id } }),
    prisma.checklistTemplate.update({
      where: { id },
      data: {
        title: draft.title,
        standard: draft.standard ?? null,
        sectorId: draft.sectorId || null,
        items: { create: itemsData(draft) },
      },
    }),
  ]);

  return { ok: true, id };
}

export async function archiveChecklistTemplate(id: string): Promise<{ ok: boolean }> {
  const companyId = await getActiveCompanyId();

  const result = await prisma.checklistTemplate.updateMany({
    where: { id, companyId, archivedAt: null },
    data: { archivedAt: new Date() },
  });

  return { ok: result.count > 0 };
}
