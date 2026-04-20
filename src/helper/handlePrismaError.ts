/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { IErrorSource, TErrorResponse } from "../interface/errorInterfaces";
import { Prisma } from "../generated/prisma/client";

export const handlePrismaError = (err: any): TErrorResponse | null => {
    let statusCode = 500;
    let message = "Prisma Error";
    let errorSources: IErrorSource[] = [
        {
            path: "",
            message: err.message,
        },
    ];

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = status.BAD_REQUEST;
        message = "Validation Error";
        const lines = err.message.trim().split('\n');
        errorSources = [
            {
                path: "",
                message: lines[lines.length - 1] || "Invalid data provided",
            },
        ];
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = status.CONFLICT;
            message = "Duplicate Entry";
            const fields = err.meta?.target as string[];
            errorSources = [
                {
                    path: fields ? fields.join(",") : "",
                    message: `Duplicate value for ${fields ? fields.join(", ") : "field"}`,
                },
            ];
        } else if (err.code === "P2003") {
            statusCode = status.BAD_REQUEST;
            message = "Foreign Key Constraint Failed";
            const field = err.meta?.field_name as string;
            errorSources = [
                {
                    path: field || "",
                    message: "Foreign key constraint failed",
                },
            ];
        } else if (err.code === "P2025") {
            statusCode = status.NOT_FOUND;
            message = "Record Not Found";
            errorSources = [
                {
                    path: "",
                    message: (err.meta?.cause as string) || "Record not found",
                },
            ];
        } else {
            statusCode = status.BAD_REQUEST;
            message = "Prisma Known Request Error";
            errorSources = [
                {
                    path: err.code,
                    message: err.message,
                },
            ];
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = "Unknown Prisma Error";
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = "Prisma Initialization Error";
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = "Prisma Rust Panic Error";
    } else {
        return null;
    }

    return {
        statusCode,
        message,
        errorSources,
        success: false,
    };
};
