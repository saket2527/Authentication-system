import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (user) {
      return NextResponse.json(
        { error: "Email or username is already in use" },
        { status: 409 },
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();
    try {
      await sendEmail({
        email: normalizedEmail,
        userId: newUser._id.toString(),
      });
    } catch (error: unknown) {
      await newUser.deleteOne();
      console.error("Signup verification email delivery failed:", error);
      return NextResponse.json(
        {
          error:
            "We couldn't send the verification email. Check your SMTP settings and try again.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        message: "Account created. Check your email to verify your account.",
        success: true,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Signup failed:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Email or username is already in use" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      {
        error: "Signup failed. Please try again.",
      },
      { status: 500 },
    );
  }
}
