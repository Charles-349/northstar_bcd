import { Express } from "express";
import {
    escalateQueryController,
    getTicketByNumberController,
} from "./support.controller";

const supportRoutes = (app: Express) => {

    // NS-12: Escalate an unresolved query into a support ticket
    app.route("/support/escalate").post(
        async (req, res, next) => {
            try {
                await escalateQueryController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // Get ticket status by ticket number
    app.route("/support/tickets/:ticketNumber").get(
        async (req, res, next) => {
            try {
                await getTicketByNumberController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

};

export default supportRoutes;
