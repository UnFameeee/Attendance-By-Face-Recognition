/*
  Warnings:

  - You are about to drop the column `status` on the `workshift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `workshift` DROP COLUMN `status`,
    ADD COLUMN `absent` BOOLEAN NOT NULL DEFAULT false;
