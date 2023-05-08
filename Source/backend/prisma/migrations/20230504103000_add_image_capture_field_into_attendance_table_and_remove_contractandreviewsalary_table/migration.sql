/*
  Warnings:

  - You are about to drop the `contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salaryreview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `contract_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `salaryreview` DROP FOREIGN KEY `salaryreview_contractId_fkey`;

-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `checkinCapture` VARCHAR(191) NULL,
    ADD COLUMN `checkoutCapture` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `contract`;

-- DropTable
DROP TABLE `salaryreview`;
