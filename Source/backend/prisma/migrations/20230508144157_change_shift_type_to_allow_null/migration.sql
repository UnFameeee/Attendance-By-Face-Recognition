-- DropForeignKey
ALTER TABLE `workshift` DROP FOREIGN KEY `workshift_shiftTypeId_fkey`;

-- AlterTable
ALTER TABLE `workshift` MODIFY `shiftTypeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `workshift` ADD CONSTRAINT `workshift_shiftTypeId_fkey` FOREIGN KEY (`shiftTypeId`) REFERENCES `shifttype`(`shiftTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;
