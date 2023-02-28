/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `joining_date` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `phone_Number` on the `profile` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joiningDate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `date_of_birth`,
    DROP COLUMN `joining_date`,
    DROP COLUMN `phone_Number`,
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL,
    ADD COLUMN `joiningDate` DATETIME(3) NOT NULL,
    ADD COLUMN `phoneNumber` INTEGER NOT NULL;
