/*
  Warnings:

  - You are about to drop the column `sender` on the `message` table. All the data in the column will be lost.
  - Added the required column `senderUserId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Conversation_startedBy_fkey` ON `conversation`;

-- DropIndex
DROP INDEX `ConversationUsers_conversationId_fkey` ON `conversationusers`;

-- DropIndex
DROP INDEX `ConversationUsers_userId_fkey` ON `conversationusers`;

-- DropIndex
DROP INDEX `Message_conversationId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_sender_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `sender`,
    ADD COLUMN `senderUserId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_startedBy_fkey` FOREIGN KEY (`startedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationUsers` ADD CONSTRAINT `ConversationUsers_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationUsers` ADD CONSTRAINT `ConversationUsers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
