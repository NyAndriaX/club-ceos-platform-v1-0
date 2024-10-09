-- AlterTable
ALTER TABLE `topics` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
