import fastify from "fastify";
import { createEvent } from "./http/create-event";
import { registerForEvent } from "./http/register-for-event";
import { getEvent } from "./http/get-event";

const app = fastify();

// app.get("/", async (request, reply) => {
//   return { hello: "world" };
// });

app.post("/events", createEvent);
app.post("/events/:eventId/attendees", registerForEvent);
app.get("/events/:eventId", getEvent);
// app.p

app.listen({
    port: 3333,
}).then(() => {
    console.log("Server is running on http://localhost:3333");
});
