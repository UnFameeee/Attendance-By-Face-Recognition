/*
  Warnings:

  - You are about to drop the column `index` on the `employeeimage` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `employeeimage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employeeimage` DROP COLUMN `index`,
    DROP COLUMN `isPrimary`;
