/*
  Warnings:

  - Added the required column `coverImage` to the `topic_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `topic_types` ADD COLUMN `coverImage` VARCHAR(255) NOT NULL;
