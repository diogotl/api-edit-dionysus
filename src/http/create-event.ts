import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { generateSlug } from "../utils/generate-slug";

export async function createEvent(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    console.log(request.body);

    const createEventSchema = z.object({
        title: z.string().min(5),
        details: z.string().nullable(),
        maxAttendees: z.number().int().positive().nullable(),
        slug: z.string().min(5),
    });

    const data = createEventSchema.parse(request.body);

    const existingEvent = await prisma.event.findUnique({
        where: {
            slug: data.slug,
        },
    });

    if (existingEvent) {
        return reply.code(400).send({
            error: "Event already exists",
        });
    }

    const newEvent = {
        title: data.title,
        details: data.details,
        maxAttendees: data.maxAttendees,
        slug: generateSlug(data.title),
    };

    const event = await prisma.event.create({
        data: newEvent,
    });

    reply.code(201).send(event);
}
