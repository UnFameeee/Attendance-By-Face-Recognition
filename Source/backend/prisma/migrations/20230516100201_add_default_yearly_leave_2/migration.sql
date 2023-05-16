/*
  Warnings:

  - Made the column `yearlyAnnualLeave` on table `organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `organization` MODIFY `yearlyAnnualLeave` INTEGER NOT NULL DEFAULT 12;
