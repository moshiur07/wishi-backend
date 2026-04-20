/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import AppError from "../../../helper/AppError";
import status from "http-status";
import { paginationHelper } from "../../utils/paginationHelper";

const createContribution = async (payload: { giver: string, amount: number, message?: string, wishItemId: string }, userId?: string) => {
    const wishItem = await prisma.wishItem.findUnique({
        where: { id: payload.wishItemId }
    });

    if (!wishItem) {
        throw new AppError(status.NOT_FOUND, "Wish item not found");
    }

    if (wishItem.status === "CLOSED" || wishItem.status === "CANCELLED") {
        throw new AppError(status.BAD_REQUEST, `This wish item is ${wishItem.status.toLowerCase()} and cannot receive contributions.`);
    }

    const result = await prisma.contribution.create({
        data: {
            ...payload,
            userId,
        },
    });
    return result;
};

const getContributionsByWishItem = async (wishItemId: string, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.contribution.findMany({
        where: { wishItemId },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    username: true
                }
            }
        }
    });

    const total = await prisma.contribution.count({ where: { wishItemId } });

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const getMyContributions = async (userId: string, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.contribution.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            wishItem: {
                select: {
                    id: true,
                    title: true,
                    imageUrl: true,
                    price: true
                }
            }
        }
    });

    const total = await prisma.contribution.count({ where: { userId } });

    return {
        meta: { page, limit, total },
        data: result,
    };
};

export const ContributionServices = {
    createContribution,
    getContributionsByWishItem,
    getMyContributions
};
