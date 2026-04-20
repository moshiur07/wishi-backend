/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContributionServices } from "./contribution.services";
import status from "http-status";
import { auth as betterAuth } from "../../lib/auth";
import pick from "../../utils/pick";

const createContribution = catchAsync(async (req: Request, res: Response) => {
    const session = await betterAuth.api.getSession({
        headers: req.headers as any,
    });
    const userId = session?.user?.id;

    const result = await ContributionServices.createContribution(req.body, userId);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Contribution recorded successfully",
        data: result,
    });
});

const getContributionsByWishItem = catchAsync(async (req: Request, res: Response) => {
    const { wishItemId } = req.params;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await ContributionServices.getContributionsByWishItem(wishItemId as string, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Contributions fetched successfully",
        data: result,
    });
});

const getMyContributions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await ContributionServices.getMyContributions(userId as string, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My contributions fetched successfully",
        data: result,
    });
});

export const ContributionController = {
    createContribution,
    getContributionsByWishItem,
    getMyContributions
};
