import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hash } from "bcryptjs";
import { BadRequestError } from "../errors/bad-request-error";
import { prisma } from "../libs/prisma";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
  });

  const { name, email, password } = registerSchema.parse(request.body);

  const checkIfUserExists = await prisma.attendee.findFirst({
    where: {
      email,
    },
  });

  if (checkIfUserExists) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await hash(password, 8);

  const user = await prisma.attendee.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
  });

  const token = await reply.jwtSign({
    sub: user.id,
    name: user.name,
  });

  return reply.status(201).send({
    token,
  });
}
