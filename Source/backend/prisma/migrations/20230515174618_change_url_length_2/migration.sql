/*
  Warnings:

  - The primary key for the `urlmanagement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `payroll` table. If the table is not empty, all the data it contains will be lost.
  - The required column `urlId` was added to the `urlmanagement` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `payroll` DROP FOREIGN KEY `payroll_employeeId_fkey`;

-- AlterTable
ALTER TABLE `urlmanagement` DROP PRIMARY KEY,
    ADD COLUMN `urlId` VARCHAR(191) NOT NULL,
    MODIFY `URL` TEXT NOT NULL,
    ADD PRIMARY KEY (`urlId`);

-- DropTable
DROP TABLE `payroll`;
