/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma";
import { WishItem, Prisma } from "../../../generated/prisma/client";
import { paginationHelper } from "../../utils/paginationHelper";

const createWishItem = async (payload: Partial<WishItem>, userId: string) => {
    const result = await prisma.wishItem.create({
        data: {
            ...payload,
            userId,
        } as any,
    });
    return result;
};

const getMyWishItems = async (userId: string, filters: any, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.WishItemWhereInput[] = [{ userId }];

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: (filterData as any)[key],
            })),
        });
    }

    const whereConditions: Prisma.WishItemWhereInput = { AND: andConditions };

    const result = await prisma.wishItem.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            contributions: true,
            occasion: {
                select: {
                    id: true,
                    name: true,
                    date: true
                }
            }
        }
    });

    const total = await prisma.wishItem.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const getPublicWishlist = async (username: string, filters: any, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const user = await prisma.user.findFirst({
        where: { username },
    });

    if (!user) throw new Error("User not found");

    const andConditions: Prisma.WishItemWhereInput[] = [
        { userId: user.id },
        { status: "OPEN" }
    ];

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: (filterData as any)[key],
            })),
        });
    }

    const whereConditions: Prisma.WishItemWhereInput = { AND: andConditions };

    const result = await prisma.wishItem.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            contributions: {
                select: {
                    giver: true,
                    amount: true,
                    message: true,
                    createdAt: true
                }
            },
            occasion: true
        }
    });

    const total = await prisma.wishItem.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const getWishItemById = async (id: string) => {
    const result = await prisma.wishItem.findUnique({
        where: { id },
        include: {
            contributions: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                    phone: true // For bKash reveal logic
                }
            },
            occasion: true
        }
    });

    if (result) {
        const totalContributed = result.contributions.reduce((sum, c) => sum + c.amount, 0);
        const fundingPercentage = (totalContributed / result.price) * 100;
        return {
            ...result,
            analytics: {
                totalContributed,
                fundingPercentage: Math.min(fundingPercentage, 100),
                isFullyFunded: totalContributed >= result.price
            }
        };
    }

    return result;
};

const updateWishItem = async (id: string, userId: string, payload: Partial<WishItem>) => {
    const item = await prisma.wishItem.findUnique({ where: { id } });
    if (!item) throw new Error("Wish item not found");
    if (item.userId !== userId) throw new Error("Not authorized");

    const result = await prisma.wishItem.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteWishItem = async (id: string, userId: string) => {
    const item = await prisma.wishItem.findUnique({ where: { id } });
    if (!item) throw new Error("Wish item not found");
    if (item.userId !== userId) throw new Error("Not authorized");

    const result = await prisma.wishItem.delete({
        where: { id },
    });
    return result;
};

const togglePinStatus = async (id: string, userId: string) => {
    const item = await prisma.wishItem.findUnique({ where: { id } });
    if (!item) throw new Error("Wish item not found");
    if (item.userId !== userId) throw new Error("Not authorized");

    const result = await prisma.wishItem.update({
        where: { id },
        data: { isPinned: !item.isPinned },
    });
    return result;
};

export const WishlistServices = {
    createWishItem,
    getMyWishItems,
    getPublicWishlist,
    getWishItemById,
    updateWishItem,
    deleteWishItem,
    togglePinStatus
};
