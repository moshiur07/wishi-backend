import { Role } from "../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
    try {
        const adminEmail = envVars.ADMIN_EMAIL;
        const adminPassword = envVars.ADMIN_PASSWORD;
        const adminUsername = envVars.ADMIN_USERNAME;

        const isUserExists = await prisma.user.findFirst({
            where: {
                role: Role.ADMIN,
            },
        });

        if (isUserExists) {
            console.log("Admin already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Generate a random ID or use a placeholder
        const adminId = `admin-${Date.now()}`;

        const admin = await prisma.user.create({
            data: {
                id: adminId,
                name: "Admin",
                email: adminEmail,
                username: adminUsername,
                role: Role.ADMIN,
                accounts: {
                    create: {
                        id: `account-${Date.now()}`,
                        accountId: adminId,
                        providerId: "credential",
                        password: hashedPassword,
                    },
                },
            },
        });

        console.log("Admin seeded successfully:", admin.email);
    } catch (error) {
        console.error("Error seeding admin:", error);
    } finally {
        await prisma.$disconnect();
    }
};

seedAdmin();
