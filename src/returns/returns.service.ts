import { and, desc, eq, inArray } from "drizzle-orm";
import db from "../Drizzle/db";
import { orders, returns, refunds } from "../Drizzle/schema";

const RETURN_WINDOW_DAYS = 90;

export const checkReturnEligibilityService = async (
    orderNumber: string
) => {
    const order = await db.query.orders.findFirst({
        where: eq(
            orders.orderNumber,
            orderNumber
        ),
    });

    if (!order) {
        return {
            eligible: false,
            reason: "Order not found.",
        };
    }

    if (order.status !== "DELIVERED") {
        return {
            eligible: false,
            reason: "Order has not been delivered yet.",
        };
    }

    if (!order.deliveredAt) {
        return {
            eligible: false,
            reason: "No delivery date on record for this order.",
        };
    }

    const deadline = new Date(order.deliveredAt);

    deadline.setDate(
        deadline.getDate() + RETURN_WINDOW_DAYS
    );

    if (new Date() > deadline) {
        return {
            eligible: false,
            reason: `Return window of ${RETURN_WINDOW_DAYS} days has expired.`,
        };
    }

    const activeReturn = await db.query.returns.findFirst({
        where: and(
            eq(returns.orderId, order.id),
            inArray(returns.status, [
                "REQUESTED",
                "APPROVED",
            ])
        ),
    });

    if (activeReturn) {
        return {
            eligible: false,
            reason: "A return is already in progress for this order.",
        };
    }

    return {
        eligible: true,
        reason: `Order delivered within ${RETURN_WINDOW_DAYS} days. Eligible for return.`,
    };
};

export const createReturnService = async (data: {
    orderNumber: string;
    customerId: number;
    reason: string;
}) => {
    const order = await db.query.orders.findFirst({
        where: and(
            eq(
                orders.orderNumber,
                data.orderNumber
            ),
            eq(
                orders.customerId,
                data.customerId
            )
        ),
    });

    if (!order) {
        throw new Error(
            "Order not found or does not belong to this customer."
        );
    }

    if (!data.reason?.trim()) {
        throw new Error(
            "Return reason is required."
        );
    }

    const eligibility =
        await checkReturnEligibilityService(
            data.orderNumber
        );

    if (!eligibility.eligible) {
        throw new Error(
            eligibility.reason
        );
    }

    const returnNumber =
        `RET-${Date.now()}`;

    const [newReturn] =
        await db
            .insert(returns)
            .values({
                returnNumber,
                orderId: order.id,
                customerId: data.customerId,
                reason: data.reason.trim(),
                status: "REQUESTED",
            })
            .returning();

    return newReturn;
};

export const getCustomerReturnsService =
    async (
        customerId: number
    ) => {
        return await db.query.returns.findMany({
            where: eq(
                returns.customerId,
                customerId
            ),

            orderBy: [
                desc(
                    returns.requestedAt
                ),
            ],

            with: {
                order: {
                    columns: {
                        orderNumber: true,
                        status: true,
                    },
                },

                refunds: true,
            },
        });
    };

export const getRefundStatusService = async (
    returnNumber: string
) => {
    const returnRecord =
        await db.query.returns.findFirst({
            where: eq(
                returns.returnNumber,
                returnNumber
            ),
        });

    if (!returnRecord) {
        return null;
    }

    const refund =
        await db.query.refunds.findFirst({
            where: eq(
                refunds.returnId,
                returnRecord.id
            ),
        });

    return {
        returnNumber:
            returnRecord.returnNumber,

        returnStatus:
            returnRecord.status,

        refundStatus:
            refund?.status ??
            "NOT_STARTED",

        refundAmount:
            refund?.amount ?? null,

        refundNumber:
            refund?.refundNumber ?? null,

        processedAt:
            refund?.processedAt ?? null,
    };
};