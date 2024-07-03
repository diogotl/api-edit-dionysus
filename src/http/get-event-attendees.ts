import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../libs/prisma";
import z from "zod";

export async function getEventAttendees(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const getEventAttendees = z.object({
        slug: z.string(),
    });

    const { slug } = getEventAttendees.parse(request.params);

    const getEventAttendeesQuery = z.object({
        query: z.string().nullish(),
        pageIndex: z.string().nullish().default("0").transform(Number),
    });

    const { pageIndex, query } = getEventAttendeesQuery.parse(request.query);

    const attendees = await prisma.attendeeEvent.findMany({
        where: query
            ? {
                  event: {
                      slug,
                  },
                  attendee: {
                      name: {
                          contains: query,
                      },
                  },
              }
            : {
                  event: {
                      slug,
                  },
              },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            attendee: true,
            event: true,
        },
    });

    const total = await prisma.attendeeEvent.count({
        where: query
            ? {
                  event: {
                      slug,
                  },
                  attendee: {
                      name: {
                          contains: query,
                      },
                  },
              }
            : {
                  event: {
                      slug,
                  },
              },
    });

    return reply.code(200).send({
        event: attendees[0]?.event,
        attendees,
        total,
    });
}
