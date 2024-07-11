import cors from "@fastify/cors";
import fastify from "fastify";
import { checkIn } from "./http/check-in";
import { createEvent } from "./http/create-event";
import { getEvent } from "./http/get-event";
import { getEventAttendees } from "./http/get-event-attendees";
import { getEvents } from "./http/get-events";
import { registerForEvent } from "./http/register-for-event";
import { env } from "node:process";

export const app = fastify();

app.register(cors, {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
});

app.get("/events", getEvents);
app.post("/events", createEvent);
app.post("/events/:eventId/attendees", registerForEvent);
app.get("/events/:eventId", getEvent);
app.get("/events/:slug/attendees", getEventAttendees);
app.patch("/events/check-in", checkIn);

app.listen({
    host: "0.0.0.0",
    port: Number(env.PORT),
}).then(() => {
    console.log(`HTTP Server Running! 🚀 ${env.PORT}`);
});
