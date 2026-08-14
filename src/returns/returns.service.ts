import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { orders, returns, refunds } from "../Drizzle/schema";

const RETURN_WINDOW_DAYS = 30;

// NS-7: Check if an order is eligible for a return
export const checkReturnEligibilityService = async (orderNumber: string) => {
    const order = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, orderNumber),
        with: {
            returns: true,
        },
    });

    if (!order) {
        return { eligible: false, reason: "Order not found." };
    }

    if (order.status !== "DELIVERED") {
        return { eligible: false, reason: "Order has not been delivered yet." };
    }

    if (!order.deliveredAt) {
        return { eligible: false, reason: "No delivery date on record for this order." };
    }

    const deadline = new Date(order.deliveredAt);
    deadline.setDate(deadline.getDate() + RETURN_WINDOW_DAYS);

    if (new Date() > deadline) {
        return {
            eligible: false,
            reason: `Return window of ${RETURN_WINDOW_DAYS} days has expired.`,
        };
    }

    const activeReturn = order.returns?.find(
        (r: any) => r.status === "REQUESTED" || r.status === "APPROVED"
    );
    if (activeReturn) {
        return { eligible: false, reason: "A return is already in progress for this order." };
    }

    return {
        eligible: true,
        reason: `Order delivered within ${RETURN_WINDOW_DAYS} days. Eligible for return.`,
    };
};

// NS-8: Create a return request (re-checks eligibility server-side)
export const createReturnService = async (data: {
    orderNumber: string;
    customerId: number;
    reason: string;
}) => {
    const order = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, data.orderNumber),
    });

    if (!order) {
        throw new Error("Order not found.");
    }

    const eligibility = await checkReturnEligibilityService(data.orderNumber);
    if (!eligibility.eligible) {
        throw new Error(eligibility.reason);
    }

    const returnNumber = `RET-${Date.now()}`;

    const [newReturn] = await db
        .insert(returns)
        .values({
            returnNumber,
            orderId: order.id,
            customerId: data.customerId,
            reason: data.reason,
            status: "REQUESTED",
        })
        .returning();

    return newReturn;
};

// NS-9: Get refund status for a return
export const getRefundStatusService = async (returnNumber: string) => {
    const returnRecord = await db.query.returns.findFirst({
        where: eq(returns.returnNumber, returnNumber),
    });

    if (!returnRecord) {
        return null;
    }

    const refund = await db.query.refunds.findFirst({
        where: eq(refunds.returnId, returnRecord.id),
    });

    return {
        returnNumber: returnRecord.returnNumber,
        returnStatus: returnRecord.status,
        refundStatus: refund ? refund.status : "NOT_STARTED",
        refundAmount: refund ? refund.amount : null,
    };
};
