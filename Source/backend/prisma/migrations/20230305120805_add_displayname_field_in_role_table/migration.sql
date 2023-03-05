/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `displayName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_displayName_key` ON `Role`(`displayName`);
