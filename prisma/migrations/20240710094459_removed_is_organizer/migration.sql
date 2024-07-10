/*
  Warnings:

  - You are about to drop the column `is_organizer` on the `attendee_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendee_events" DROP COLUMN "is_organizer";
