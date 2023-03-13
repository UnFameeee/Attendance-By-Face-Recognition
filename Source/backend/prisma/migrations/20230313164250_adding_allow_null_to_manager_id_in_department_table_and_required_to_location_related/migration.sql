/*
  Warnings:

  - You are about to alter the column `phoneNumber` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `locationId` on table `department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locationId` on table `organization` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `organization` DROP FOREIGN KEY `Organization_locationId_fkey`;

-- AlterTable
ALTER TABLE `department` MODIFY `locationId` VARCHAR(191) NOT NULL,
    MODIFY `managerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` MODIFY `phoneNumber` INTEGER NULL;

-- AlterTable
ALTER TABLE `organization` MODIFY `locationId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
