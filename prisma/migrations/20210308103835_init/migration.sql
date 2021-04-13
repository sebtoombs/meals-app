/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FamilyToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FamilyToUser" DROP CONSTRAINT "_FamilyToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FamilyToUser" DROP CONSTRAINT "_FamilyToUser_B_fkey";

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "_FamilyToUser";

-- CreateTable
CREATE TABLE "_UserFamilies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFamilies_AB_unique" ON "_UserFamilies"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFamilies_B_index" ON "_UserFamilies"("B");

-- AddForeignKey
ALTER TABLE "_UserFamilies" ADD FOREIGN KEY ("A") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFamilies" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
