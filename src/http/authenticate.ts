import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { prisma } from "../libs/prisma";
import { BadRequestError } from "../errors/bad-request-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionBodySchema = z.object({
    email: z
      .string()
      .email()
      .transform((v) => v.toLowerCase()),
    password: z.string().min(6),
  });

  const { email, password } = sessionBodySchema.parse(request.body);

  const user = await prisma.attendee.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const doesPasswordMatches = await compare(password, user.password_hash!);

  if (!doesPasswordMatches) {
    throw new BadRequestError("Invalid credentials");
  }

  const token = await reply.jwtSign({
    sub: user.id,
  });

  return reply.status(201).send({
    token,
  });
}
