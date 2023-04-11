/*
  Warnings:

  - You are about to drop the column `endTime` on the `workshift` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `workshift` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shiftName]` on the table `shifttype` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shiftDate]` on the table `workshift` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `officialBreakingHours` to the `organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialWorkingHours` to the `organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `Contract_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `departmentmanager` DROP FOREIGN KEY `DepartmentManager_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `departmentmanager` DROP FOREIGN KEY `DepartmentManager_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `leaverequest` DROP FOREIGN KEY `LeaveRequest_approverId_fkey`;

-- DropForeignKey
ALTER TABLE `leaverequest` DROP FOREIGN KEY `LeaveRequest_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `leaverequest` DROP FOREIGN KEY `LeaveRequest_leaveTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `organization` DROP FOREIGN KEY `Organization_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `payroll` DROP FOREIGN KEY `Payroll_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_resourceId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `salaryreview` DROP FOREIGN KEY `SalaryReview_contractId_fkey`;

-- DropForeignKey
ALTER TABLE `workshift` DROP FOREIGN KEY `Workshift_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `workshift` DROP FOREIGN KEY `Workshift_shiftTypeId_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `worktype` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `organization` ADD COLUMN `officialBreakingHours` VARCHAR(191) NOT NULL,
    ADD COLUMN `officialWorkingHours` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `workshift` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`;

-- CreateTable
CREATE TABLE `employeeimage` (
    `imageId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL,
    `isPrimary` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`imageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `shifttype_shiftName_key` ON `shifttype`(`shiftName`);

-- CreateIndex
CREATE UNIQUE INDEX `workshift_shiftDate_key` ON `workshift`(`shiftDate`);

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`locationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employeeimage` ADD CONSTRAINT `employeeimage_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rolepermission` ADD CONSTRAINT `rolepermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rolepermission` ADD CONSTRAINT `rolepermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`permissionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rolepermission` ADD CONSTRAINT `rolepermission_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `resource`(`resourceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization` ADD CONSTRAINT `organization_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`organizationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departmentmanager` ADD CONSTRAINT `departmentmanager_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departmentmanager` ADD CONSTRAINT `departmentmanager_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workshift` ADD CONSTRAINT `workshift_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workshift` ADD CONSTRAINT `workshift_shiftTypeId_fkey` FOREIGN KEY (`shiftTypeId`) REFERENCES `shifttype`(`shiftTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract` ADD CONSTRAINT `contract_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salaryreview` ADD CONSTRAINT `salaryreview_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contract`(`contractId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaverequest` ADD CONSTRAINT `leaverequest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaverequest` ADD CONSTRAINT `leaverequest_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaverequest` ADD CONSTRAINT `leaverequest_leaveTypeId_fkey` FOREIGN KEY (`leaveTypeId`) REFERENCES `leavetype`(`leaveTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll` ADD CONSTRAINT `payroll_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `department` RENAME INDEX `Department_locationId_key` TO `department_locationId_key`;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_email_key` TO `employee_email_key`;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_locationId_key` TO `employee_locationId_key`;

-- RenameIndex
ALTER TABLE `organization` RENAME INDEX `Organization_locationId_key` TO `organization_locationId_key`;

-- RenameIndex
ALTER TABLE `permission` RENAME INDEX `Permission_permissionName_key` TO `permission_permissionName_key`;

-- RenameIndex
ALTER TABLE `resource` RENAME INDEX `Resource_resourceName_key` TO `resource_resourceName_key`;

-- RenameIndex
ALTER TABLE `role` RENAME INDEX `Role_displayName_key` TO `role_displayName_key`;

-- RenameIndex
ALTER TABLE `role` RENAME INDEX `Role_roleName_key` TO `role_roleName_key`;
