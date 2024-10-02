-- CreateTable
CREATE TABLE `topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('COMMUNAUTE', 'EVENEMENT', 'GUIDE', 'QUESTION', 'MODELE', 'ARTICLES', 'ANNONCE') NOT NULL,
    `themeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_topic_theme`(`themeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `themes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
