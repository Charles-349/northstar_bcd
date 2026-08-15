import { Express } from "express";
import {
    escalateQueryController,
    getTicketByNumberController,
} from "./support.controller";

const supportRoutes = (app: Express) => {
    app.post(
        "/support/queries/:queryId/escalate",
        escalateQueryController
    );

    app.get(
        "/support/tickets/:ticketNumber",
        getTicketByNumberController
    );
};

export default supportRoutes;