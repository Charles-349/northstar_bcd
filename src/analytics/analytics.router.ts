import { Express } from "express";
import { getAnalyticsController } from "./analytics.controller";


const analytics = (app: Express) => {

        
    app.route("/analytics").get(
        async (req, res, next) => {

            try {

                await getAnalyticsController(req, res);

            } catch (error) {

                next(error);

            }

        }
    );


};


export default analytics;