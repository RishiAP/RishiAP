-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('CASE_STUDY', 'PACKAGE', 'LIBRARY', 'EXPERIMENT', 'FIRMWARE', 'TOOL', 'APPLICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('WORK', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE', 'OPEN_SOURCE', 'LEADERSHIP');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" "ProjectCategory" NOT NULL DEFAULT 'CASE_STUDY',
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "packageName" TEXT,
ADD COLUMN     "packageRegistry" TEXT,
ADD COLUMN     "packageUrl" TEXT,
ADD COLUMN     "repoName" TEXT,
ADD COLUMN     "repoOwner" TEXT,
ADD COLUMN     "topics" TEXT[],
ALTER COLUMN "problem" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "type" "ExperienceType" NOT NULL,
    "role" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "orgUrl" TEXT,
    "location" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "description" TEXT,
    "techStack" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experience_published_order_idx" ON "Experience"("published", "order");

-- CreateIndex
CREATE INDEX "Project_published_category_idx" ON "Project"("published", "category");
