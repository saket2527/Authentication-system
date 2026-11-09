import { connect } from "@/dbConfig/dbConfig";
import {
  hashVerificationToken,
  isVerificationToken,
} from "@/helpers/emailVerificationToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { token } = reqBody;

    if (!isVerificationToken(token)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const tokenHash = hashVerificationToken(token);
    const user = await User.findOne({
      verifyToken: tokenHash,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: unknown) {
    console.error("Email verification failed:", error);
    return NextResponse.json(
      { error: "Email verification failed. Please try again." },
      { status: 500 },
    );
  }
}
