import db from "../Drizzle/db";
import {
    supportQueries,
    supportTickets,
    orders,
    returns,
    refunds,
} from "../Drizzle/schema";

import { count, eq } from "drizzle-orm";

export const getAnalyticsService = async () => {
    // Total support queries
    const [totalQueries] = await db
        .select({
            count: count(),
        })
        .from(supportQueries);

    // Automatically resolved queries
    const [automatedQueries] = await db
        .select({
            count: count(),
        })
        .from(supportQueries)
        .where(eq(supportQueries.resolutionType, "AUTOMATED"));

    // Escalated queries
    const [escalatedQueries] = await db
        .select({
            count: count(),
        })
        .from(supportQueries)
        .where(eq(supportQueries.resolutionType, "ESCALATED"));

    // Resolved queries
    const [resolvedQueries] = await db
        .select({
            count: count(),
        })
        .from(supportQueries)
        .where(eq(supportQueries.resolved, true));

    // Support tickets
    const [totalTickets] = await db
        .select({
            count: count(),
        })
        .from(supportTickets);

    const [openTickets] = await db
        .select({
            count: count(),
        })
        .from(supportTickets)
        .where(eq(supportTickets.status, "OPEN"));

    const [inProgressTickets] = await db
        .select({
            count: count(),
        })
        .from(supportTickets)
        .where(eq(supportTickets.status, "IN_PROGRESS"));

    const [closedTickets] = await db
        .select({
            count: count(),
        })
        .from(supportTickets)
        .where(eq(supportTickets.status, "CLOSED"));

    // Orders
    const [totalOrders] = await db
        .select({
            count: count(),
        })
        .from(orders);

    const [deliveredOrders] = await db
        .select({
            count: count(),
        })
        .from(orders)
        .where(eq(orders.status, "DELIVERED"));

    const [cancelledOrders] = await db
        .select({
            count: count(),
        })
        .from(orders)
        .where(eq(orders.status, "CANCELLED"));

    // Returns
    const [totalReturns] = await db
        .select({
            count: count(),
        })
        .from(returns);

    // Refunds
    const [totalRefunds] = await db
        .select({
            count: count(),
        })
        .from(refunds);

    const total = Number(totalQueries.count);
    const automated = Number(automatedQueries.count);
    const escalated = Number(escalatedQueries.count);

    const deflectionRate =
        total > 0
            ? Math.round((automated / total) * 100)
            : 0;

    const estimatedHoursSaved =
        ((automated * 15) / 60).toFixed(1);

    return {
        support: {
            totalQueries: total,
            automated,
            escalated,
            resolved: Number(resolvedQueries.count),
            deflectionRate,
            estimatedHoursSaved,
        },

        tickets: {
            total: Number(totalTickets.count),
            open: Number(openTickets.count),
            inProgress: Number(inProgressTickets.count),
            closed: Number(closedTickets.count),
        },

        orders: {
            total: Number(totalOrders.count),
            delivered: Number(deliveredOrders.count),
            cancelled: Number(cancelledOrders.count),
        },

        returns: {
            total: Number(totalReturns.count),
        },

        refunds: {
            total: Number(totalRefunds.count),
        },
    };
};