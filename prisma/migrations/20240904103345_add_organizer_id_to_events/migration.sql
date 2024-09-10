-- AlterTable
ALTER TABLE "events" ADD COLUMN     "organizer_id" TEXT;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "attendees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
