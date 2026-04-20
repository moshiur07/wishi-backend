import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AIServices } from "./ai.services";
import status from "http-status";

const getSuggestions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { prompt } = req.body;
    const result = await AIServices.getGiftSuggestions(prompt, userId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "AI Suggestions fetched successfully",
        data: result,
    });
});

export const AIController = {
    getSuggestions
};
