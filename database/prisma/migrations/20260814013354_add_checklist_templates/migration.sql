-- CreateEnum
CREATE TYPE "Criticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('COMPLIANCE');

-- CreateEnum
CREATE TYPE "RegulatoryStandard" AS ENUM ('NR_01', 'NR_05', 'NR_06', 'NR_07', 'NR_09', 'NR_10', 'NR_11', 'NR_12', 'NR_13', 'NR_17', 'NR_18', 'NR_20', 'NR_23', 'NR_26', 'NR_33', 'NR_35', 'OTHER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sector" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_template" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "standard" "RegulatoryStandard",
    "sectorId" TEXT,
    "createdById" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_template_item" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "section" TEXT,
    "criticality" "Criticality" NOT NULL DEFAULT 'MEDIUM',
    "answerType" "AnswerType" NOT NULL DEFAULT 'COMPLIANCE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_template_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sector_companyId_idx" ON "sector"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "sector_companyId_name_key" ON "sector"("companyId", "name");

-- CreateIndex
CREATE INDEX "checklist_template_companyId_archivedAt_idx" ON "checklist_template"("companyId", "archivedAt");

-- CreateIndex
CREATE INDEX "checklist_template_sectorId_idx" ON "checklist_template"("sectorId");

-- CreateIndex
CREATE INDEX "checklist_template_item_templateId_idx" ON "checklist_template_item"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_template_item_templateId_position_key" ON "checklist_template_item"("templateId", "position");

-- CreateIndex
CREATE INDEX "user_companyId_idx" ON "user"("companyId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector" ADD CONSTRAINT "sector_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_template" ADD CONSTRAINT "checklist_template_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_template" ADD CONSTRAINT "checklist_template_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_template" ADD CONSTRAINT "checklist_template_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_template_item" ADD CONSTRAINT "checklist_template_item_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

