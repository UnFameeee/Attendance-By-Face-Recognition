/*
  Warnings:

  - You are about to drop the column `isApproved` on the `leaverequest` table. All the data in the column will be lost.
  - Added the required column `status` to the `leaverequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `leaverequest` DROP COLUMN `isApproved`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
