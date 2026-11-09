import nodemailer from "nodemailer";
import User from "@/models/userModel";
import { createVerificationToken } from "@/helpers/emailVerificationToken";

interface SendEmailOptions {
  email: string;
  userId: string;
}

export const sendEmail = async ({ email, userId }: SendEmailOptions) => {
  const { MAIL_USER, MAIL_PASS, DOMAIN } = process.env;
  const smtpHost = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
  const smtpPort = Number(process.env.SMTP_PORT || "2525");
  if (!MAIL_USER || !MAIL_PASS || !DOMAIN) {
    throw new Error("MAIL_USER, MAIL_PASS, and DOMAIN must be configured");
  }
  if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  const { token, tokenHash } = createVerificationToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await User.findByIdAndUpdate(userId, {
    verifyToken: tokenHash,
    verifyTokenExpiry: expiresAt,
  });

  const verificationUrl = new URL("/verifyemail", DOMAIN);
  verificationUrl.searchParams.set("token", token);
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });

  return transport.sendMail({
    from: process.env.MAIL_FROM || MAIL_USER,
    to: email,
    subject: "Verify your email",
    text: `Open this link to verify your email: ${verificationUrl.toString()}`,
    html: `<p>Open <a href="${verificationUrl.toString()}">this link</a> to verify your email.</p>`,
  });
};
