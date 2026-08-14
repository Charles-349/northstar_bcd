import { Express } from "express";
import {
    getReturnEligibilityController,
    createReturnController,
    getRefundStatusController,
} from "./returns.controller";

const returnRoutes = (app: Express) => {

    // NS-7: Check if an order is eligible for return
    app.route("/returns/eligibility/:orderNumber").get(
        async (req, res, next) => {
            try {
                await getReturnEligibilityController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // NS-8: Create a return request
    app.route("/returns").post(
        async (req, res, next) => {
            try {
                await createReturnController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    // NS-9: Get refund status for a return
    app.route("/returns/:returnNumber/refund-status").get(
        async (req, res, next) => {
            try {
                await getRefundStatusController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

};

export default returnRoutes;
