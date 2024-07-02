import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../libs/prisma";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
    const checkInSchema = z.object({
        attendeeId: z.string(),
        eventId: z.string(),
    });

    const { attendeeId, eventId } = checkInSchema.parse(request.body);

    const attendee = await prisma.attendeeEvent.findFirst({
        where: {
            attendeeId: attendeeId,
            eventId: eventId,
        },
    });

    if (!attendee) {
        return reply.code(404).send({
            error: "Attendee not found",
        });
    }

    const updatedAttendee = await prisma.attendeeEvent.update({
        where: {
            id: attendeeId,
        },
        data: {
            hasAttended: true,
        },
    });

    return reply.code(200).send({
        updatedAttendee,
    });
}
