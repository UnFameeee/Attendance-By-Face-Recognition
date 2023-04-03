/*
  Warnings:

  - You are about to drop the column `endTime` on the `workshift` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `workshift` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shiftName]` on the table `ShiftType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shiftDate]` on the table `Workshift` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `officialBreakingHours` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialWorkingHours` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `worktype` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `organization` ADD COLUMN `officialBreakingHours` VARCHAR(191) NOT NULL,
    ADD COLUMN `officialWorkingHours` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `workshift` DROP COLUMN `endTime`,
    DROP COLUMN `startTime`;

-- CreateIndex
CREATE UNIQUE INDEX `ShiftType_shiftName_key` ON `ShiftType`(`shiftName`);

-- CreateIndex
CREATE UNIQUE INDEX `Workshift_shiftDate_key` ON `Workshift`(`shiftDate`);
