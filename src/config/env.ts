import dotenv from "dotenv";
import AppError from "../helper/AppError";
import status from "http-status";

dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    FACEBOOK_CLIENT_ID: string;
    FACEBOOK_CLIENT_SECRET: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    ADMIN_USERNAME: string;
    CORS_ORIGIN: string;
}

const loadEnvVars = (): EnvConfig => {
    const requireVars = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "FACEBOOK_CLIENT_ID",
        "FACEBOOK_CLIENT_SECRET",
        "BETTER_AUTH_URL",
        "BETTER_AUTH_SECRET",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ADMIN_USERNAME",
        "CORS_ORIGIN",
    ];
    requireVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new AppError(
                status.INTERNAL_SERVER_ERROR,
                `Environment variable ${varName} is required but not defined.`,
            );
        }
    });
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID as string,
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        ADMIN_USERNAME: process.env.ADMIN_USERNAME as string,
        CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    };
};

export const envVars = loadEnvVars();