import fastify from "fastify";
import cors from '@fastify/cors';
import { createTrip } from "./routes/create_trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm_trip";
import { confirmParticipant } from "./routes/confirm_participant";
import { createActivity } from "./routes/create_activity";
import { getActivities } from "./routes/get_activities";
import { createLinks } from "./routes/create_link";
import { getLinks } from "./routes/get_links";

const app = fastify();
const PORT = 3333;
app.register(cors, {
    origin: '*',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(createActivity);
app.register(getActivities);
app.register(createLinks);
app.register(getLinks);

app.listen({ port: PORT }).then(() => console.log('server is running.'));