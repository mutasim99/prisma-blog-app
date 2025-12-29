import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            },
            phone: {
                type: "string",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    }
});