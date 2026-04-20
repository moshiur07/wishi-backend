/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import AppError from "../../../helper/AppError";
import status from "http-status";
import { paginationHelper } from "../../utils/paginationHelper";

const createOccasion = async (userId: string, payload: { name: string, date?: string | Date }) => {
    const result = await prisma.occasion.create({
        data: {
            ...payload,
            userId,
        },
    });
    return result;
};

const getMyOccasions = async (userId: string, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.occasion.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            _count: {
                select: { wishItems: true }
            }
        }
    });

    const total = await prisma.occasion.count({ where: { userId } });

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const getOccasionById = async (id: string, userId: string) => {
    const result = await prisma.occasion.findUnique({
        where: { id },
        include: {
            wishItems: {
                include: {
                    contributions: true
                }
            }
        }
    });

    if (!result) throw new AppError(status.NOT_FOUND, "Occasion not found");
    if (result.userId !== userId) throw new AppError(status.FORBIDDEN, "Not authorized to view this occasion");

    return result;
};

const updateOccasion = async (id: string, userId: string, payload: Partial<{ name: string, date: string | Date }>) => {
    const occasion = await prisma.occasion.findUnique({ where: { id } });

    if (!occasion) throw new AppError(status.NOT_FOUND, "Occasion not found");
    if (occasion.userId !== userId) throw new AppError(status.FORBIDDEN, "Not authorized to update this occasion");

    const result = await prisma.occasion.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteOccasion = async (id: string, userId: string) => {
    const occasion = await prisma.occasion.findUnique({ where: { id } });

    if (!occasion) throw new AppError(status.NOT_FOUND, "Occasion not found");
    if (occasion.userId !== userId) throw new AppError(status.FORBIDDEN, "Not authorized to delete this occasion");

    const result = await prisma.occasion.delete({
        where: { id },
    });
    return result;
};

export const OccasionServices = {
    createOccasion,
    getMyOccasions,
    getOccasionById,
    updateOccasion,
    deleteOccasion,
};
