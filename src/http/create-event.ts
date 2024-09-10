import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../libs/prisma";
import { generateSlug } from "../utils/generate-slug";
import { BadRequestError } from "../errors/bad-request-error";

export async function createEvent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = await request.getCurrentUserId();

  const createEventSchema = z.object({
    title: z.string().min(5),
    details: z.string().nullable(),
    maxAttendees: z.number().int().positive().nullable(),
    date: z.string(),
  });

  const data = createEventSchema.parse(request.body);

  const existingEvent = await prisma.event.findFirst({
    where: {
      title: data.title,
    },
  });

  const parsedDate = new Date(data.date).toISOString();

  if (existingEvent) {
    throw new BadRequestError("Event already exists");
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maxAttendees: data.maxAttendees,
      slug: generateSlug(data.title),
      date: parsedDate,
      organizerId: userId,
    },
  });

  return reply.code(201).send(event);
}
