import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistServices } from "./wishlist.services";
import status from "http-status";
import pick from "../../utils/pick";

const createWishItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await WishlistServices.createWishItem(req.body, userId as string);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Wish item created successfully",
        data: result,
    });
});

const getMyWishItems = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const filters = pick(req.query, ["searchTerm", "category", "status", "occasionId"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await WishlistServices.getMyWishItems(userId as string, filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Wish items fetched successfully",
        data: result,
    });
});

const getPublicWishlist = catchAsync(async (req: Request, res: Response) => {
    const { username } = req.params;
    const filters = pick(req.query, ["searchTerm", "category", "occasionId"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await WishlistServices.getPublicWishlist(username as string, filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Public wishlist fetched successfully",
        data: result,
    });
});

const getWishItemById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await WishlistServices.getWishItemById(id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Wish item fetched successfully",
        data: result,
    });
});

const updateWishItem = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await WishlistServices.updateWishItem(id as string, userId as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Wish item updated successfully",
        data: result,
    });
});

const deleteWishItem = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.id;
    const result = await WishlistServices.deleteWishItem(id as string, userId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Wish item deleted successfully",
        data: result,
    });
});

const togglePinStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await WishlistServices.togglePinStatus(id as string, userId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Wish item pin status toggled",
        data: result,
    });
});

export const WishlistController = {
    createWishItem,
    getMyWishItems,
    getPublicWishlist,
    getWishItemById,
    updateWishItem,
    deleteWishItem,
    togglePinStatus
};
