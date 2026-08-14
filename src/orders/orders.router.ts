import { Express } from "express";

import {
    getOrderByNumberController,
    getOrderTrackingController,
    getCustomerOrdersController
} from "./orders.controller";


const order = (app: Express) => {

        // Get all orders belonging to a customer
    app.route("/orders/customer/:customerId").get(
        async (req, res, next) => {

            try {

                await getCustomerOrdersController(req, res);

            } catch (error) {

                next(error);

            }

        }
    );

        // Get order tracking information
    app.route("/orders/:orderNumber/tracking").get(
        async (req, res, next) => {

            try {

                await getOrderTrackingController(req, res);

            } catch (error) {

                next(error);

            }

        }
    );

    // Get complete order details
    app.route("/orders/:orderNumber").get(
        async (req, res, next) => {

            try {

                await getOrderByNumberController(req, res);

            } catch (error) {

                next(error);

            }

        }
    );

};


export default order;