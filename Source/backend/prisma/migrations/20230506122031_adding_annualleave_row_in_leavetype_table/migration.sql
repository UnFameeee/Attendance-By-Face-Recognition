/*
  Warnings:

  - Added the required column `annualLeave` to the `leavetype` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `leavetype` ADD COLUMN `annualLeave` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `organization` ADD COLUMN `yearlyAnnualLeave` INTEGER NULL;
