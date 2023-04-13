/*
  Warnings:

  - You are about to drop the column `earlyDeparture` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `earlyDeparture`,
    ADD COLUMN `earlyLeave` DATETIME(3) NULL;
