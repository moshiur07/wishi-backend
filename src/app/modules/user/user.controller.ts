import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";
import status from "http-status";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await UserServices.getMyProfile(userId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Profile fetched successfully",
        data: result,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await UserServices.updateProfile(userId as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const getPublicProfile = catchAsync(async (req: Request, res: Response) => {
    const { username } = req.params;
    const result = await UserServices.getPublicProfile(username as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Public profile fetched successfully",
        data: result,
    });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await UserServices.getDashboardStats(userId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: result,
    });
});

export const UserController = {
    getMyProfile,
    updateProfile,
    getPublicProfile,
    getDashboardStats
};
