import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { generateSlug } from "../utils/generate-slug";

export async function registerForEvent(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const registerForEvent = z.object({
        name: z.string().min(5),
        email: z.string().email(),
    });

    const { email, name } = registerForEvent.parse(request.body);

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
        return reply.code(404).send({
            error: "Event not found",
        });
    }

    const amountOfEventAttenddees = await prisma.attendee.count({
        where: {
            eventId,
        },
    });

    if (event.maxAttendees && amountOfEventAttenddees >= event.maxAttendees) {
        return reply.code(400).send({
            error: "Event is full",
        });
    }

    const isUserAlreadyRegistered = await prisma.attendee.findUnique({
        where: {
            eventId_email: {
                email,
                eventId,
            },
        },
    });

    if (isUserAlreadyRegistered) {
        return reply.code(400).send({
            error: "User already registered",
        });
    }

    const attendee = await prisma.attendee.create({
        data: {
            name: name,
            email: email,
            eventId,
        },
    });

    return reply.code(201).send(attendee);
}
