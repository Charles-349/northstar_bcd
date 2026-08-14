import { Request, Response } from "express";
import {
    escalateQueryService,
    getTicketByNumberService,
} from "./support.service";

// NS-12: Escalate a support query into a ticket
export const escalateQueryController = async (req: Request, res: Response) => {
    try {
        const { queryId, subject } = req.body;

        if (!queryId) {
            return res.status(400).json({
                message: "queryId is required",
            });
        }

        const ticket = await escalateQueryService({ queryId, subject });
        return res.status(201).json(ticket);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

// Get ticket status by ticket number
export const getTicketByNumberController = async (
    req: Request<{ ticketNumber: string }>,
    res: Response
) => {
    try {
        const { ticketNumber } = req.params;

        if (!ticketNumber) {
            return res.status(400).json({ message: "Ticket number is required" });
        }

        const ticket = await getTicketByNumberService(ticketNumber);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        return res.status(200).json(ticket);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
