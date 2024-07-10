import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../libs/prisma";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
    const checkInSchema = z.object({
        eventId: z.string(),
        attendeeId: z.string(),
    });

    const { attendeeId, eventId } = checkInSchema.parse(request.body);

    console.log(attendeeId, eventId);

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

    if (attendee.hasAttended != null) {
        return reply.code(400).send({
            error: "Attendee has already checked in",
        });
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
