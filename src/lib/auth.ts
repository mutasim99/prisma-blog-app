import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});


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
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
            const info = await transporter.sendMail({
                from: '"prisma Blog" <virginmr882@gmail.com>',
                to: user.email,
                subject: "Blog App Verification",
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Email Verification</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:40px 0;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
                          
                          <!-- Header -->
                          <tr>
                            <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;">
                              <h1 style="margin:0;">Prisma Blog</h1>
                            </td>
                          </tr>
                
                          <!-- Content -->
                          <tr>
                            <td style="padding:30px; color:#333333;">
                              <h2>Hello ${user.name},</h2>
                              <p>
                                Thanks for signing up to <strong>Prisma Blog</strong>.
                                Please verify your email address by clicking the button below.
                              </p>
                
                              <div style="text-align:center; margin:30px 0;">
                                <a href="${verificationUrl}"
                                   style="background:#4f46e5; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:6px; display:inline-block;">
                                  Verify Email
                                </a>
                              </div>
                
                              <p style="font-size:14px; color:#666;">
                                If you did not create this account, you can safely ignore this email.
                              </p>
                
                              <p style="margin-top:30px;">
                                Thanks,<br/>
                                <strong>Prisma Blog Team</strong>
                              </p>
                            </td>
                          </tr>
                
                          <!-- Footer -->
                          <tr>
                            <td style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#888;">
                              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
                            </td>
                          </tr>
                
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                `,
            });

            console.log("Message sent:", info.messageId);
        },
    },
});