/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import { User } from "../../../generated/prisma/client";
import status from "http-status";
import AppError from "../../../helper/AppError";

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw new AppError(status.NOT_FOUND, "User not found");
    if (user.isDeleted) throw new AppError(status.FORBIDDEN, "This account is deleted");
    if (user.isBlocked) throw new AppError(status.FORBIDDEN, "This account is blocked");

    return user;
};

const updateProfile = async (userId: string, payload: any) => {
    if (payload.username) {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: payload.username,
                id: { not: userId }
            }
        });

        if (existingUser) {
            throw new AppError(status.CONFLICT, "Username is already taken");
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: payload,
    });

    return updatedUser;
};

const getPublicProfile = async (username: string) => {
    const user = await prisma.user.findFirst({
        where: { username, isDeleted: false, isBlocked: false },
        select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            image: true,
            location: true,
            socialLinks: true,
            createdAt: true,
        }
    });

    if (!user) throw new AppError(status.NOT_FOUND, "User profile not found");

    // Get some basic stats for the public profile
    const wishItemsCount = await prisma.wishItem.count({
        where: { userId: user.id, status: "OPEN" }
    });

    return {
        ...user,
        stats: {
            activeWishItems: wishItemsCount
        }
    };
};

const getDashboardStats = async (userId: string) => {
    const totalWishItems = await prisma.wishItem.count({ where: { userId } });
    const openWishItems = await prisma.wishItem.count({ where: { userId, status: "OPEN" } });
    const contributionsReceived = await prisma.contribution.count({
        where: { wishItem: { userId } }
    });

    const recentContributions = await prisma.contribution.findMany({
        where: { wishItem: { userId } },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            wishItem: {
                select: { title: true }
            }
        }
    });

    return {
        totalWishItems,
        openWishItems,
        contributionsReceived,
        recentContributions
    };
};

export const UserServices = {
    getMyProfile,
    updateProfile,
    getPublicProfile,
    getDashboardStats
};
