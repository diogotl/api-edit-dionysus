/*
  Warnings:

  - You are about to drop the column `password_hash` on the `attendees` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "attendees_email_key";

-- AlterTable
ALTER TABLE "attendees" DROP COLUMN "password_hash";
