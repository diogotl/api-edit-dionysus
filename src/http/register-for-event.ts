import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { prisma } from "../libs/prisma";

export async function registerForEvent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = await request.getCurrentUserId();

  const registerForEventParam = z.object({
    eventId: z.string(),
  });

  const { eventId } = registerForEventParam.parse(request.params);

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const amountOfEventAttenddees = await prisma.attendeeEvent.count({
    where: {
      eventId,
    },
  });

  if (event.maxAttendees && amountOfEventAttenddees >= event.maxAttendees) {
    throw new BadRequestError("Event is full");
  }

  const isUserAlreadyRegistered = await prisma.attendeeEvent.findFirst({
    include: {
      attendee: true,
      event: true,
    },
    where: {
      attendee: {
        id: userId,
      },
      event: {
        id: eventId,
      },
    },
  });

  if (isUserAlreadyRegistered) {
    console.log(isUserAlreadyRegistered);
    throw new BadRequestError("User already registered for this event");
  }

  const ticket = await prisma.attendeeEvent.create({
    data: {
      attendeeId: userId,
      eventId: event.id,
    },
    include: {
      attendee: true,
    },
  });

  return reply.code(201).send({
    ticket,
  });
}
