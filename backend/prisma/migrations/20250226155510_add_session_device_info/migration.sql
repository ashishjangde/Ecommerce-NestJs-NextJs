-- DropForeignKey
ALTER TABLE "Sessions" DROP CONSTRAINT "Sessions_userId_fkey";

-- AlterTable
ALTER TABLE "Sessions" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Sessions_userId_idx" ON "Sessions"("userId");

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
