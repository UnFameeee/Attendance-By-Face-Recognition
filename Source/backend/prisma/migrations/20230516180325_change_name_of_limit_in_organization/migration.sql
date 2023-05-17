/*
  Warnings:

  - You are about to drop the column `limitLateArrive` on the `organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `organization` DROP COLUMN `limitLateArrive`,
    ADD COLUMN `limitLateArrival` VARCHAR(191) NOT NULL DEFAULT '01:00';
