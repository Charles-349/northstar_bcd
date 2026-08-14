import { Request, Response } from "express";
import {
    checkReturnEligibilityService,
    createReturnService,
    getRefundStatusService,
} from "./returns.service";

// NS-7: Get return eligibility by order number
export const getReturnEligibilityController = async (
    req: Request<{ orderNumber: string }>,
    res: Response
) => {
    try {
        const { orderNumber } = req.params;

        if (!orderNumber) {
            return res.status(400).json({
                message: "Order number is required",
            });
        }

        const result = await checkReturnEligibilityService(orderNumber);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// NS-8: Create a return request
export const createReturnController = async (req: Request, res: Response) => {
    try {
        const { orderNumber, customerId, reason } = req.body;

        if (!orderNumber || !customerId || !reason) {
            return res.status(400).json({
                message: "orderNumber, customerId and reason are required",
            });
        }

        const newReturn = await createReturnService({ orderNumber, customerId, reason });
        return res.status(201).json(newReturn);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

// NS-9: Get refund status by return number
export const getRefundStatusController = async (
    req: Request<{ returnNumber: string }>,
    res: Response
) => {
    try {
        const { returnNumber } = req.params;

        if (!returnNumber) {
            return res.status(400).json({
                message: "Return number is required",
            });
        }

        const result = await getRefundStatusService(returnNumber);

        if (!result) {
            return res.status(404).json({ message: "Return not found" });
        }

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
