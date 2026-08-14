import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PILOT_COMPANY_NAME = "CBT";
const PILOT_SECTORS = ["Produção", "Logística", "Manutenção", "Administrativo"];

async function main() {
  const company =
    (await prisma.company.findFirst({ where: { name: PILOT_COMPANY_NAME } })) ??
    (await prisma.company.create({ data: { name: PILOT_COMPANY_NAME } }));

  for (const name of PILOT_SECTORS) {
    await prisma.sector.upsert({
      where: { companyId_name: { companyId: company.id, name } },
      update: {},
      create: { companyId: company.id, name },
    });
  }

  const { count } = await prisma.user.updateMany({
    where: { companyId: null },
    data: { companyId: company.id },
  });

  console.log(`Empresa "${company.name}" (${company.id}) pronta.`);
  console.log(`${PILOT_SECTORS.length} setor(es) garantido(s).`);
  console.log(`${count} usuário(s) sem empresa vinculado(s) a "${company.name}".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
