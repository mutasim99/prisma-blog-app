import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth.middleware"


const seedAdmin = async () => {
    try {
        const adminData = {
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL as string,
            role: UserRole.ADMIN,
            password: process.env.PASSWORD
        };

        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            throw new Error('Admin is already exists')
        };

        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        });

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }
        console.log(signUpAdmin);
        
    } catch (error) {
        console.log(error);

    }
};

seedAdmin();