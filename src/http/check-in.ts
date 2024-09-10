import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ForbiddenError } from "../errors/forbidden-error";
import { NotFoundError } from "../errors/not-found-error";
import { prisma } from "../libs/prisma";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
  const userId = await request.getCurrentUserId();

  const checkInSchema = z.object({
    eventId: z.string(),
    attendeeId: z.string(),
  });

  const { attendeeId, eventId } = checkInSchema.parse(request.body);

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.organizerId !== userId) {
    throw new ForbiddenError("You are not the organizer of this event");
  }

  const attendee = await prisma.attendeeEvent.findFirst({
    where: {
      attendeeId: attendeeId,
      eventId: eventId,
    },
  });

  if (!attendee) {
    throw new NotFoundError("Attendee not found");
  }

  if (attendee.hasAttended != null) {
    throw new ForbiddenError("Attendee has already checked in");
  }

  const updatedAttendee = await prisma.attendeeEvent.update({
    where: {
      id: attendee.id,
    },
    data: {
      hasAttended: new Date(),
    },
  });

  return reply.code(200).send(updatedAttendee);
}
