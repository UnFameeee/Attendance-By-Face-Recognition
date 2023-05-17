-- AlterTable
ALTER TABLE `organization` ADD COLUMN `limitEarlyLeave` VARCHAR(191) NOT NULL DEFAULT '01:00',
    ADD COLUMN `limitLateArrive` VARCHAR(191) NOT NULL DEFAULT '01:00';
