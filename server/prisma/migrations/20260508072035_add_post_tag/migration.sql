/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `posts` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_authorName_authorEmail_fkey`;

-- DropIndex
DROP INDEX `posts_authorName_authorEmail_fkey` ON `posts`;

-- DropIndex
DROP INDEX `users_name_email_key` ON `users`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `authorEmail`,
    DROP COLUMN `authorName`,
    DROP COLUMN `category`,
    ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `coverImage` VARCHAR(191) NULL,
    ADD COLUMN `coverPublicId` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    MODIFY `content` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tags_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PostTags_AB_unique`(`A`, `B`),
    INDEX `_PostTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `posts_authorId_idx` ON `posts`(`authorId`);

-- CreateIndex
CREATE INDEX `posts_status_idx` ON `posts`(`status`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
