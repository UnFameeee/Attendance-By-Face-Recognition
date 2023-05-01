/*
  Warnings:

  - You are about to drop the column `department` on the `attendanceexception` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `attendanceexception` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendanceexception` DROP COLUMN `department`,
    ADD COLUMN `departmentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `attendanceexception` ADD CONSTRAINT `attendanceexception_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`departmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
