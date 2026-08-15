import { Request, Response } from "express";

import {
    checkReturnEligibilityService,
    createReturnService,
    getCustomerReturnsService,
    getRefundStatusService,
} from "./returns.service";



export const getReturnEligibilityController =
    async (
        req: Request<{
            orderNumber: string;
        }>,
        res: Response
    ) => {

        try {

            const {
                orderNumber,
            } = req.params;

            if (!orderNumber) {
                return res.status(400).json({
                    message:
                        "Order number is required.",
                });
            }

            const result =
                await checkReturnEligibilityService(
                    orderNumber.trim()
                );

            return res.status(200).json(
                result
            );

        } catch (error: any) {

            console.error(
                "Return eligibility error:",
                error
            );

            return res.status(500).json({
                message:
                    error.message ||
                    "Unable to check return eligibility.",
            });
        }
    };



export const createReturnController =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                orderNumber,
                customerId,
                reason,
            } = req.body;

            if (
                !orderNumber ||
                typeof orderNumber !== "string"
            ) {
                return res.status(400).json({
                    message:
                        "Order number is required.",
                });
            }

            if (
                customerId === undefined ||
                customerId === null ||
                customerId === ""
            ) {
                return res.status(400).json({
                    message:
                        "Customer ID is required.",
                });
            }

            const parsedCustomerId =
                Number(customerId);

            if (
                Number.isNaN(
                    parsedCustomerId
                ) ||
                parsedCustomerId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Customer ID must be a valid number.",
                });
            }

            if (
                !reason ||
                typeof reason !== "string" ||
                !reason.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Return reason is required.",
                });
            }

            const newReturn =
                await createReturnService({
                    orderNumber:
                        orderNumber.trim(),

                    customerId:
                        parsedCustomerId,

                    reason:
                        reason.trim(),
                });

            return res.status(201).json({
                message:
                    "Return request created successfully.",

                return: newReturn,
            });

        } catch (error: any) {

            console.error(
                "Create return error:",
                error
            );

            return res.status(400).json({
                message:
                    error.message ||
                    "Unable to create return request.",
            });
        }
    };



export const getCustomerReturnsController =
    async (
        req: Request<{
            customerId: string;
        }>,
        res: Response
    ) => {

        try {

            const customerId =
                Number(
                    req.params.customerId
                );

            if (
                Number.isNaN(customerId) ||
                customerId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid customer ID is required.",
                });
            }

            const customerReturns =
                await getCustomerReturnsService(
                    customerId
                );

            return res.status(200).json({
                returns:
                    customerReturns,
            });

        } catch (error: any) {

            console.error(
                "Get customer returns error:",
                error
            );

            return res.status(500).json({
                message:
                    error.message ||
                    "Unable to retrieve customer returns.",
            });
        }
    };



export const getRefundStatusController =
    async (
        req: Request<{
            returnNumber: string;
        }>,
        res: Response
    ) => {

        try {

            const {
                returnNumber,
            } = req.params;

            if (!returnNumber) {
                return res.status(400).json({
                    message:
                        "Return number is required.",
                });
            }

            const result =
                await getRefundStatusService(
                    returnNumber.trim()
                );

            if (!result) {
                return res.status(404).json({
                    message:
                        "Return not found.",
                });
            }

            return res.status(200).json(
                result
            );

        } catch (error: any) {

            console.error(
                "Refund status error:",
                error
            );

            return res.status(500).json({
                message:
                    error.message ||
                    "Unable to retrieve refund status.",
            });
        }
    };