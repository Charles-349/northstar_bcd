import { eq } from "drizzle-orm";

import db from "../Drizzle/db";

import {
    supportQueries,
    supportTickets,
} from "../Drizzle/schema";


export const escalateQueryService = async (
    data: {
        queryId: number;
        subject?: string;
    }
) => {

    const query =
        await db.query.supportQueries.findFirst({
            where: eq(
                supportQueries.id,
                data.queryId
            ),
        });

    if (!query) {
        throw new Error(
            "Support query not found."
        );
    }

    if (query.resolved) {
        throw new Error(
            "This query has already been resolved and cannot be escalated."
        );
    }

    const ticketNumber =
        `TCK-${Date.now()}`;

    const [newTicket] =
        await db
            .insert(supportTickets)
            .values({
                ticketNumber,

                category:
                    query.category,

                subject:
                    data.subject?.trim() ||
                    query.question.slice(
                        0,
                        100
                    ),

                description:
                    query.question,

                status: "OPEN",
            })
            .returning();

    // Mark the original query as escalated
    await db
        .update(supportQueries)
        .set({
            resolved: true,
            resolutionType:
                "ESCALATED",
        })
        .where(
            eq(
                supportQueries.id,
                data.queryId
            )
        );

    return newTicket;
};


export const getTicketByNumberService =
    async (
        ticketNumber: string
    ) => {

        return await db.query.supportTickets.findFirst({
            where: eq(
                supportTickets.ticketNumber,
                ticketNumber
            ),
        });
    };