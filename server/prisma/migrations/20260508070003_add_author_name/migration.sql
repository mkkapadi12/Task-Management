/*
  Warnings:

  - A unique constraint covering the columns `[name,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorName` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_authorEmail_fkey`;

-- DropIndex
DROP INDEX `posts_authorEmail_fkey` ON `posts`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `authorName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_name_email_key` ON `users`(`name`, `email`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorName_authorEmail_fkey` FOREIGN KEY (`authorName`, `authorEmail`) REFERENCES `users`(`name`, `email`) ON DELETE RESTRICT ON UPDATE CASCADE;
