import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import {
    orders,
    customers,
    orderItems,
    products
} from "../Drizzle/schema";


// Get order by order number
export const getOrderByNumberService = async (
    orderNumber: string
) => {

    return await db.query.orders.findFirst({
        where: eq(orders.orderNumber, orderNumber),

        with: {
            customer: true,

            items: {
                with: {
                    product: true
                }
            },

            returns: {
                with: {
                    refunds: true
                }
            },

            refunds: true
        }
    });
};


// Get order tracking information
export const getOrderTrackingService = async (
    orderNumber: string
) => {

    return await db.query.orders.findFirst({
        where: eq(orders.orderNumber, orderNumber),

        columns: {
            id: true,
            orderNumber: true,
            status: true,
            carrier: true,
            trackingNumber: true,
            estimatedDelivery: true,
            deliveredAt: true,
            createdAt: true,
            updatedAt: true
        }
    });
};


// Get all orders belonging to a customer
export const getCustomerOrdersService = async (
    customerId: number
) => {

    return await db.query.orders.findMany({
        where: eq(orders.customerId, customerId),

        with: {
            items: {
                with: {
                    product: true
                }
            }
        }
    });
};