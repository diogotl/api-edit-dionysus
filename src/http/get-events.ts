import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../libs/prisma";
import z from "zod";
import { Prisma } from "@prisma/client";

export async function getEvents(request: FastifyRequest, reply: FastifyReply) {
  const getEventAttendeesQuery = z.object({
    query: z.string().nullish(),
    pageIndex: z.string().nullish().default("0").transform(Number),
  });

  const { pageIndex, query } = getEventAttendeesQuery.parse(request.query);

  const whereClause: Prisma.EventWhereInput = query
    ? { title: { contains: query, mode: 'insensitive' } }
    : {};

  const events = await prisma.event.findMany({
    take: 10,
    skip: pageIndex * 10,
    where: whereClause,
    include: {
      _count: {
        select: {
          AttendeeEvent: true,
        },
      },
    },
  });

  const response = events.map((event) => ({
    id: event.id,
    title: event.title,
    details: event.details,
    slug: event.slug,
    date: event.date,
    maxAttendees: event.maxAttendees,
    attendeesCount: event._count.AttendeeEvent,
  }));

  const total = await prisma.event.count({
    where: whereClause
  });

  return reply.status(200).send({
    events: response,
    total,
  });
}
