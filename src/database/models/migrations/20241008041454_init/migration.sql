-- AlterTable
ALTER TABLE `User` MODIFY `revenueFileUrl` TEXT NOT NULL,
    MODIFY `profile` TEXT NULL;

-- AlterTable
ALTER TABLE `topic_types` MODIFY `coverImage` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `topics` MODIFY `coverImage` TEXT NULL;
