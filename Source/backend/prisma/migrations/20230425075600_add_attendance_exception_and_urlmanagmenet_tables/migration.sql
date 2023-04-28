-- CreateTable
CREATE TABLE `attendanceexception` (
    `attendanceExceptionId` VARCHAR(191) NOT NULL,
    `approverId` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `AttendanceType` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attendanceExceptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `urlmanagment` (
    `URL` VARCHAR(191) NOT NULL,
    `expiredTime` DATETIME(3) NOT NULL,
    `isExpired` BOOLEAN NOT NULL,

    PRIMARY KEY (`URL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendanceexception` ADD CONSTRAINT `attendanceexception_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
