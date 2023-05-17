-- AlterTable
ALTER TABLE `workshift` ADD COLUMN `allowEarlyLeave` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `allowLateArrival` BOOLEAN NOT NULL DEFAULT false;
