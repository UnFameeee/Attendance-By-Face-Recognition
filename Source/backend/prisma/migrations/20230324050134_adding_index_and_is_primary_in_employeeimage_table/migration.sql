/*
  Warnings:

  - Added the required column `index` to the `EmployeeImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPrimary` to the `EmployeeImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employeeimage` ADD COLUMN `index` INTEGER NOT NULL,
    ADD COLUMN `isPrimary` BOOLEAN NOT NULL;
