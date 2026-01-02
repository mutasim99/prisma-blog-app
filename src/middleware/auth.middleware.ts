import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from '../lib/auth'
import { fromNodeHeaders } from 'better-auth/node';

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            })

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: 'you are not authorized!'
                })
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'please verify your email'
                })
            }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            }

            if (roles.length && !session.user.role) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden!, you can not access this"
                })
            }

            next();
        } catch (error) {
            next(error)
        }
    }
};

export default auth