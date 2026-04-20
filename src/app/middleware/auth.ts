/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../../helper/AppError";
import status from "http-status";
import { auth as betterAuth } from "../lib/auth";
import catchAsync from "../utils/catchAsync";

export const auth = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const session = await betterAuth.api.getSession({
            headers: req.headers as any,
        });

        if (!session || !session.user) {
            throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
        }

        const { user } = session;

        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user.role as string)) {
            throw new AppError(status.FORBIDDEN, "You don't have permission to perform this action!");
        }

        // Add user to request object
        (req as any).user = user as any;

        next();
    });
};
