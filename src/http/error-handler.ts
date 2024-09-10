import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { ForbiddenError } from "../errors/forbidden-error";
import { NotFoundError } from "../errors/not-found-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = async (
  error,
  request,
  reply,
) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequestError) {
    return reply.code(400).send({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.code(401).send({
      message: error.message,
    });
  }

  if (error instanceof ForbiddenError) {
    return reply.code(403).send({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return reply.code(404).send({
      message: error.message,
    });
  }

  return reply.code(500).send({
    message: "Internal server error",
  });
};
