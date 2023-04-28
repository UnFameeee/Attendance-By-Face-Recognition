/*
  Warnings:

  - You are about to drop the column `AttendanceType` on the `attendanceexception` table. All the data in the column will be lost.
  - Added the required column `attendanceType` to the `attendanceexception` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendanceexception` DROP FOREIGN KEY `attendanceexception_approverId_fkey`;

-- AlterTable
ALTER TABLE `attendanceexception` DROP COLUMN `AttendanceType`,
    ADD COLUMN `attendanceType` VARCHAR(191) NOT NULL,
    MODIFY `approverId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `attendanceexception` ADD CONSTRAINT `attendanceexception_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
