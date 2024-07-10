import fastify from "fastify";
import { createEvent } from "./http/create-event";
import { registerForEvent } from "./http/register-for-event";
import { getEvent } from "./http/get-event";
import { getEventAttendees } from "./http/get-event-attendees";
import cors from "@fastify/cors";
import { getEvents } from "./http/get-events";
import { checkIn } from "./http/check-in";

const app = fastify();

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
    port: 3333,
}).then(() => {
    console.log("Server is running on http://localhost:3333");
});
