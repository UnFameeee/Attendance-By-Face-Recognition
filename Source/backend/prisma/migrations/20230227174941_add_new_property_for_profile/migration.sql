/*
  Warnings:

  - Added the required column `address` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joining_date` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_Number` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `date_of_birth` DATETIME(3) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `joining_date` DATETIME(3) NOT NULL,
    ADD COLUMN `phone_Number` INTEGER NOT NULL,
    ADD COLUMN `picture` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL;
