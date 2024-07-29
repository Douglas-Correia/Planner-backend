import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function confirmParticipant(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        '/participants/:participantId/confirm', {
        schema: {
            params: z.object({
                participantId: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const { participantId } = request.params;

        const participant = await prisma.participant.findUnique({
            where: {
                id: participantId,
            },
        });
        const redirect = `http://localhost:5173/participants/${participant?.trip_id}`;

        if (!participant) {
            throw new Error('Participant not found.');
        }
        if (participant.is_confirmed) {
            reply.redirect(redirect)
        }

        await prisma.participant.update({
            where: {
                id: participantId,
            },
            data: {
                is_confirmed: true,
            }
        })

        return reply.redirect(redirect);
    })
}