-- DropIndex
DROP INDEX "Skill_categoryId_idx";

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Skill_categoryId_order_idx" ON "Skill"("categoryId", "order");
