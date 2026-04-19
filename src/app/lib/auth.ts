import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";
// import { envVars } from "../../config/env";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false
            },
            username: {
                type: "string",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            role: {
                type: "string",
                required: true,
                defaultValue: Role.USER
            },
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            socialLinks: {
                type: "json",
                required: false,
                defaultValue: {}
            },
            location: {
                type: "string",
                required: false,
                defaultValue: ""
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
});