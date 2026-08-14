import { Request, Response } from "express";
import {
    getOrderByNumberService,
    getOrderTrackingService,
    getCustomerOrdersService
} from "./orders.service";


// Get order by order number
export const getOrderByNumberController = async (
    req: Request<{ orderNumber: string }>,
    res: Response
) => {

    try {

        const { orderNumber } = req.params;

        if (!orderNumber) {
            return res.status(400).json({
                message: "Order number is required"
            });
        }

        const order = await getOrderByNumberService(orderNumber);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order retrieved successfully",
            order
        });

    } catch (error: any) {

        console.error("Error retrieving order:", error);

        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
};


// Get order tracking
export const getOrderTrackingController = async (
    req: Request<{ orderNumber: string }>,
    res: Response
) => {

    try {

        const { orderNumber } = req.params;

        if (!orderNumber) {
            return res.status(400).json({
                message: "Order number is required"
            });
        }

        const tracking = await getOrderTrackingService(orderNumber);

        if (!tracking) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order tracking retrieved successfully",
            tracking
        });

    } catch (error: any) {

        console.error("Error retrieving tracking:", error);

        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
};


// Get all orders belonging to a customer
export const getCustomerOrdersController = async (
    req: Request<{ customerId: string }>,
    res: Response
) => {

    try {

        const { customerId } = req.params;

        const parsedCustomerId = parseInt(customerId);

        if (isNaN(parsedCustomerId)) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        const orders = await getCustomerOrdersService(parsedCustomerId);

        return res.status(200).json({
            message: "Customer orders retrieved successfully",
            orders
        });

    } catch (error: any) {

        console.error("Error retrieving customer orders:", error);

        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
};