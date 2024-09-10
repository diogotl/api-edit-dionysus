import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "node:process";
import { authenticate } from "./http/authenticate";
import { checkIn } from "./http/check-in";
import { createEvent } from "./http/create-event";
import { errorHandler } from "./http/error-handler";
import { getEvent } from "./http/get-event";
import { getEventAttendees } from "./http/get-event-attendees";
import { getEvents } from "./http/get-events";
import { auth } from "./http/middlewares/auth";
import { register } from "./http/register";
import { registerForEvent } from "./http/register-for-event";

export const app = fastify();

app.register(cors, {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
});

app.setErrorHandler(errorHandler);

app.register(fastifyJwt, {
  secret: "my-jwt-secret",
});

app.get("/events", getEvents);
app.post("/events", createEvent);
app.post("/events/:eventId/attendees", registerForEvent).register(auth);
app.get("/events/:eventId", getEvent);
app.get("/events/:slug/attendees", getEventAttendees);
app.patch("/events/check-in", checkIn);
app.post("/authenticate", authenticate);
app.post("/register", register);

app
  .listen({
    host: "0.0.0.0",
    port: Number(env.PORT),
  })
  .then(() => {
    console.log(`HTTP Server Running! 🚀 ${env.PORT}`);
  });
