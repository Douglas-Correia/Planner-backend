import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendEmailInvited } from "../lib/send_email";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer';

export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params;

        const redirect = `http://localhost:5173/trips/${tripId}`;

        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId,
            },
            include: {
                participants: {
                    where: {
                        is_owner: false,
                    }
                }
            }
        });

        if (!trip) {
            throw new Error('Trip not found.');
        }
        if (trip.is_confirmed) {
            return reply.redirect(redirect);
        }

        await prisma.trip.update({
            where: {
                id: tripId
            },
            data: {
                is_confirmed: true,
            }
        });

        const owner_participant = await prisma.participant.findFirst({
            where: {
                trip_id: tripId,
                is_owner: true,
            },
            select: {
                name: true,
                email: true,
            },
        });

        const formattedStartDate = new Date(trip.starts_at).toLocaleDateString('pt-BR');
        const formattedEndDate = new Date(trip.ends_at).toLocaleDateString('pt-BR');

        const mail = await getMailClient();

        await Promise.all(
            trip.participants.map(async (participant) => {
                const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;
                const message = await mail.sendMail({
                    from: {
                        name: 'Equipe plann.er',
                        address: 'planner@gmail.com',
                    },
                    to: {
                        name: participant?.name ? participant.name : '',
                        address: participant.email,
                    },
                    subject: `Confirme sua viagem com ${owner_participant?.email} para ${trip.destination} em ${formattedStartDate}`,
                    html: sendEmailInvited(participant?.name, trip.destination, formattedStartDate, formattedEndDate, confirmationLink, true),
                });

                console.log(nodemailer.getTestMessageUrl(message));
            })
        )


        return reply.redirect(redirect);
    })
}