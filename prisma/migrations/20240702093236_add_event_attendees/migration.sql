/*
  Warnings:

  - You are about to drop the column `event_id` on the `attendees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password_hash` to the `attendees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendees" DROP CONSTRAINT "attendees_event_id_fkey";

-- DropIndex
DROP INDEX "attendees_event_id_email_key";

-- AlterTable
ALTER TABLE "attendees" DROP COLUMN "event_id",
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "attendee_events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "has_attended" BOOLEAN NOT NULL DEFAULT false,
    "is_organizer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attendee_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendees_email_key" ON "attendees"("email");

-- AddForeignKey
ALTER TABLE "attendee_events" ADD CONSTRAINT "attendee_events_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendee_events" ADD CONSTRAINT "attendee_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
