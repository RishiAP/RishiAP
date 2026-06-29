/*
  Warnings:

  - You are about to drop the column `language` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "language",
ADD COLUMN     "languages" TEXT[];
