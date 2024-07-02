import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../libs/prisma";

export async function getEvent(request: FastifyRequest, reply: FastifyReply) {
    const eventId = request.params.eventId;

    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
        },
        include: {
            _count: {
                select: {
                    Attendee: true,
                },
            },
        },
    });

    if (!event) {
        return reply.status(404).send({
            error: "Event not found",
        });
    }

    const response = {
        id: event.id,
        title: event.title,
        details: event.details,
        slug: event.slug,
        maxAttendees: event.maxAttendees,
        attendeesCount: event._count.Attendee,
    };

    return reply.status(200).send({
        response,
    });
}
