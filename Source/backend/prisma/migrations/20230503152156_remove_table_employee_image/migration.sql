/*
  Warnings:

  - You are about to drop the column `picture` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the `employeeimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employeeimage` DROP FOREIGN KEY `employeeimage_employeeId_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `picture`,
    ADD COLUMN `image` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `employeeimage`;
