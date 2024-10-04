-- DropForeignKey
ALTER TABLE `topics` DROP FOREIGN KEY `topics_topicTypeId_fkey`;

-- AlterTable
ALTER TABLE `topics` MODIFY `topicTypeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_topicTypeId_fkey` FOREIGN KEY (`topicTypeId`) REFERENCES `topic_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
