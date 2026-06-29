/*
  Warnings:

  - You are about to drop the column `period` on the `Education` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "period",
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "startDate" TEXT NOT NULL;
