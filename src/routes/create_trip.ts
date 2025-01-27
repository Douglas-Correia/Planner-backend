import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { sendEmailInvited } from "../lib/send_email";
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email()),
            })
        }
    }, async (request, reply) => {
        const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body;

        if (dayjs(starts_at).isBefore(new Date())) {
            throw new Error('Invalid trip start date.');
        }
        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new Error('Invalid trip end date');
        }

        const formattedStartDate = new Date(starts_at).toLocaleDateString('pt-BR');
        const formattedEndDate = new Date(ends_at).toLocaleDateString('pt-BR');
        
        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participants: {
                    createMany: {
                        data: [
                            {
                                name: owner_name,
                                email: owner_email,
                                is_owner: true,
                                is_confirmed: true,
                            },
                            ...emails_to_invite.map((email) => {
                                return {
                                    email
                                }
                            }),
                        ]
                    }
                },
            }
        });

        const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`;
        const mail = await getMailClient();
        
        const message = await mail.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'planner@gmail.com',
            },
            to: {
                name: owner_name,
                address: owner_email,
            },
            subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
            html: sendEmailInvited(owner_email, destination, formattedStartDate, formattedEndDate, confirmationLink, false),
        });

        console.log(nodemailer.getTestMessageUrl(message));

        return reply.send({ trip });
    })
}