import { Express } from "express";

import {
    getReturnEligibilityController,
    createReturnController,
    getCustomerReturnsController,
    getRefundStatusController,
} from "./returns.controller";

const returnRoutes = (
    app: Express
) => {


    app.get(
        "/returns/eligibility/:orderNumber",
        async (req, res, next) => {

            try {

                await getReturnEligibilityController(
                    req,
                    res
                );

            } catch (error) {

                next(error);

            }
        }
    );


    app.post(
        "/returns",
        async (req, res, next) => {

            try {

                await createReturnController(
                    req,
                    res
                );

            } catch (error) {

                next(error);

            }
        }
    );



    app.get(
        "/returns/customer/:customerId",
        async (req, res, next) => {

            try {

                await getCustomerReturnsController(
                    req,
                    res
                );

            } catch (error) {

                next(error);

            }
        }
    );


    app.get(
        "/returns/:returnNumber/refund-status",
        async (req, res, next) => {

            try {

                await getRefundStatusController(
                    req,
                    res
                );

            } catch (error) {

                next(error);

            }
        }
    );
};

export default returnRoutes;