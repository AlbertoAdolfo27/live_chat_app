/*
  Warnings:

  - You are about to drop the column `keyHash` on the `app` table. All the data in the column will be lost.
  - Added the required column `apiKeyHash` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Conversation_startedByUserId_fkey` ON `conversation`;

-- DropIndex
DROP INDEX `ConversationUsers_conversationId_fkey` ON `conversationusers`;

-- DropIndex
DROP INDEX `ConversationUsers_userId_fkey` ON `conversationusers`;

-- DropIndex
DROP INDEX `Message_conversationId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_senderUserId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `app` DROP COLUMN `keyHash`,
    ADD COLUMN `apiKeyHash` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_startedByUserId_fkey` FOREIGN KEY (`startedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationUsers` ADD CONSTRAINT `ConversationUsers_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationUsers` ADD CONSTRAINT `ConversationUsers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
