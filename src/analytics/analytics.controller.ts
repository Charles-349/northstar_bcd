import { Request, Response } from "express";
import { getAnalyticsService } from "./analytics.service";

export const getAnalyticsController = async (
    req: Request,
    res: Response
) => {
    try {
        const analytics = await getAnalyticsService();

        return res.status(200).json({
            message: "Analytics retrieved successfully",
            analytics,
        });
    } catch (error: any) {
        console.error("Analytics error:", error);

        return res.status(500).json({
            message: "Failed to retrieve analytics",
            error: error.message,
        });
    }
};