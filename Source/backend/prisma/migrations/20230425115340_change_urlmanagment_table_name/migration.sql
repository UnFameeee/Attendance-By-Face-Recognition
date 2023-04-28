/*
  Warnings:

  - You are about to drop the `urlmanagment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `urlmanagment`;

-- CreateTable
CREATE TABLE `urlmanagement` (
    `URL` VARCHAR(191) NOT NULL,
    `expiredTime` DATETIME(3) NOT NULL,
    `isExpired` BOOLEAN NOT NULL,

    PRIMARY KEY (`URL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
