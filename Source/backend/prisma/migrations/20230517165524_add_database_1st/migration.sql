-- CreateTable
CREATE TABLE `employee` (
    `id` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `worktype` VARCHAR(191) NULL,
    `status` BOOLEAN NULL,
    `annualLeaveDays` INTEGER NULL,
    `firsttimeLogin` BOOLEAN NOT NULL DEFAULT true,
    `isTrain` BOOLEAN NOT NULL DEFAULT false,
    `refreshToken` VARCHAR(191) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `employee_locationId_key`(`locationId`),
    UNIQUE INDEX `employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facetrainingimage` (
    `imageId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`imageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `roleId` VARCHAR(191) NOT NULL,
    `roleName` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `role_roleName_key`(`roleName`),
    UNIQUE INDEX `role_displayName_key`(`displayName`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `permissionId` VARCHAR(191) NOT NULL,
    `permissionName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `permission_permissionName_key`(`permissionName`),
    PRIMARY KEY (`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resource` (
    `resourceId` VARCHAR(191) NOT NULL,
    `resourceName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `resource_resourceName_key`(`resourceName`),
    PRIMARY KEY (`resourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rolepermission` (
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
CREATE TABLE `location` (
    `locationId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`locationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `organizationId` VARCHAR(191) NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `yearlyAnnualLeave` INTEGER NOT NULL DEFAULT 12,
    `limitEarlyLeave` VARCHAR(191) NOT NULL DEFAULT '01:00',
    `limitLateArrival` VARCHAR(191) NOT NULL DEFAULT '01:00',
    `locationId` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `organization_locationId_key`(`locationId`),
    PRIMARY KEY (`organizationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department` (
    `departmentId` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `departmentName` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `department_locationId_key`(`locationId`),
    PRIMARY KEY (`departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departmentmanager` (
    `managerId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`managerId`, `departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance` (
    `attendanceId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `attendanceDate` DATETIME(3) NOT NULL,
    `checkIn` DATETIME(3) NULL,
    `checkOut` DATETIME(3) NULL,
    `checkinCapture` VARCHAR(191) NULL,
    `checkoutCapture` VARCHAR(191) NULL,
    `lateArrival` DATETIME(3) NULL,
    `earlyLeave` DATETIME(3) NULL,
    `totalHours` DATETIME(3) NULL,
    `absent` BOOLEAN NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`attendanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workshift` (
    `shiftId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `shiftTypeId` VARCHAR(191) NULL,
    `absent` BOOLEAN NOT NULL DEFAULT false,
    `allowEarlyLeave` BOOLEAN NOT NULL DEFAULT false,
    `allowLateArrival` BOOLEAN NOT NULL DEFAULT false,
    `shiftDate` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`shiftId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shifttype` (
    `shiftTypeId` VARCHAR(191) NOT NULL,
    `shiftName` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `shifttype_shiftName_key`(`shiftName`),
    PRIMARY KEY (`shiftTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaverequest` (
    `leaveRequestId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `approverId` VARCHAR(191) NULL,
    `leaveTypeId` VARCHAR(191) NOT NULL,
    `requestDate` DATETIME(3) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`leaveRequestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leavetype` (
    `leaveTypeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `annualLeave` BOOLEAN NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`leaveTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendanceexception` (
    `attendanceExceptionId` VARCHAR(191) NOT NULL,
    `approverId` VARCHAR(191) NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `attendanceType` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attendanceExceptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `urlmanagement` (
    `urlId` VARCHAR(191) NOT NULL,
    `URL` TEXT NOT NULL,
    `expiredTime` DATETIME(3) NOT NULL,
    `isExpired` BOOLEAN NOT NULL,

    PRIMARY KEY (`urlId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`locationId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facetrainingimage` ADD CONSTRAINT `facetrainingimage_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `workshift` ADD CONSTRAINT `workshift_shiftTypeId_fkey` FOREIGN KEY (`shiftTypeId`) REFERENCES `shifttype`(`shiftTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaverequest` ADD CONSTRAINT `leaverequest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaverequest` ADD CONSTRAINT `leaverequest_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaverequest` ADD CONSTRAINT `leaverequest_leaveTypeId_fkey` FOREIGN KEY (`leaveTypeId`) REFERENCES `leavetype`(`leaveTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendanceexception` ADD CONSTRAINT `attendanceexception_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendanceexception` ADD CONSTRAINT `attendanceexception_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
