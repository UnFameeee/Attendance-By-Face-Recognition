/*
  Warnings:

  - You are about to drop the column `managerId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.
  - You are about to alter the column `phoneNumber` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `locationId` on table `Department` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `roleId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Made the column `locationId` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Department` DROP FOREIGN KEY `Department_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `Department` DROP FOREIGN KEY `Department_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `Organization` DROP FOREIGN KEY `Organization_locationId_fkey`;

-- AlterTable
ALTER TABLE `Attendance` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Contract` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Department` DROP COLUMN `managerId`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `locationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `role`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL,
    MODIFY `phoneNumber` INTEGER NULL;

-- AlterTable
ALTER TABLE `LeaveRequest` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `LeaveType` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Location` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `locationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Payroll` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `SalaryReview` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ShiftType` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Workshift` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` VARCHAR(191) NOT NULL,
    `roleName` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Role_roleName_key`(`roleName`),
    UNIQUE INDEX `Role_displayName_key`(`displayName`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `permissionId` VARCHAR(191) NOT NULL,
    `permissionName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Permission_permissionName_key`(`permissionName`),
    PRIMARY KEY (`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `resourceId` VARCHAR(191) NOT NULL,
    `resourceName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Resource_resourceName_key`(`resourceName`),
    PRIMARY KEY (`resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `resourceId` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`roleId`, `permissionId`, `resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`permissionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`resourceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentManager` ADD CONSTRAINT `DepartmentManager_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentManager` ADD CONSTRAINT `DepartmentManager_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
