import { Request, Response } from "express";

import {
    escalateQueryService,
    getTicketByNumberService,
} from "./support.services";



export const escalateQueryController =
    async (
        req: Request<{
            queryId: string;
        }>,
        res: Response
    ) => {

        try {

            const queryId =
                Number(
                    req.params.queryId
                );

            const {
                subject,
            } = req.body;

            if (
                Number.isNaN(queryId) ||
                queryId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "A valid query ID is required.",
                });
            }

            if (
                subject !== undefined &&
                typeof subject !== "string"
            ) {
                return res.status(400).json({
                    message:
                        "Subject must be a string.",
                });
            }

            const ticket =
                await escalateQueryService({
                    queryId,
                    subject,
                });

            return res.status(201).json({
                message:
                    "Support query escalated successfully.",

                ticket,
            });

        } catch (error: any) {

            console.error(
                "Escalate query error:",
                error
            );

            return res.status(400).json({
                message:
                    error.message ||
                    "Unable to escalate support query.",
            });
        }
    };

export const getTicketByNumberController =
    async (
        req: Request<{
            ticketNumber: string;
        }>,
        res: Response
    ) => {

        try {

            const {
                ticketNumber,
            } = req.params;

            if (!ticketNumber) {
                return res.status(400).json({
                    message:
                        "Ticket number is required.",
                });
            }

            const ticket =
                await getTicketByNumberService(
                    ticketNumber.trim()
                );

            if (!ticket) {
                return res.status(404).json({
                    message:
                        "Ticket not found.",
                });
            }

            return res.status(200).json({
                message:
                    "Support ticket retrieved successfully.",

                ticket,
            });

        } catch (error: any) {

            console.error(
                "Get ticket error:",
                error
            );

            return res.status(500).json({
                message:
                    error.message ||
                    "Unable to retrieve support ticket.",
            });
        }
    };