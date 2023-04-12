/*
  Warnings:

  - You are about to drop the column `officialBreakingHours` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `officialWorkingHours` on the `organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `checkIn` DATETIME(3) NULL,
    MODIFY `checkOut` DATETIME(3) NULL,
    MODIFY `earlyDeparture` DATETIME(3) NULL,
    MODIFY `lateArrival` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `organization` DROP COLUMN `officialBreakingHours`,
    DROP COLUMN `officialWorkingHours`;
