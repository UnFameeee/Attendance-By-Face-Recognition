/*
  Warnings:

  - You are about to drop the column `managerId` on the `department` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_managerId_fkey`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `managerId`;

-- CreateTable
CREATE TABLE `DepartmentManager` (
    `managerId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`managerId`, `departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DepartmentManager` ADD CONSTRAINT `DepartmentManager_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentManager` ADD CONSTRAINT `DepartmentManager_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
