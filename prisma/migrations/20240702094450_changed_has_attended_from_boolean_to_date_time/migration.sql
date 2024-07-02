/*
  Warnings:

  - Changed the type of `has_attended` on the `attendee_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "attendee_events" DROP COLUMN "has_attended",
ADD COLUMN     "has_attended" TIMESTAMP(3) NOT NULL;
