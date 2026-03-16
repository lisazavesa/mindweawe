-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('NECESSARY', 'RECOMMENDED', 'RELATED');

-- AlterTable
ALTER TABLE "Relation" ADD COLUMN     "type" "RelationType" NOT NULL DEFAULT 'NECESSARY';

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "difficulty" INTEGER,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "isCore" BOOLEAN NOT NULL DEFAULT false;
