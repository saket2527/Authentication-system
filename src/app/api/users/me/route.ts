import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: unknown) {
    unstable_rethrow(error);
    console.error("Could not retrieve user:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please log in again." },
      { status: 401 },
    );
  }
}
