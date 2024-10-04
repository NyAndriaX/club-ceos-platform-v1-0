/*
  Warnings:

  - You are about to drop the column `type` on the `topics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `topics` DROP COLUMN `type`,
    ADD COLUMN `topicTypeId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `topic_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_topicTypeId_fkey` FOREIGN KEY (`topicTypeId`) REFERENCES `topic_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
