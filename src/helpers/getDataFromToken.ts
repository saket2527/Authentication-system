import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const tokenSecret = process.env.TOKEN_SECRET;

  if (!token) {
    throw new Error("Authentication required");
  }

  if (!tokenSecret) {
    throw new Error("TOKEN_SECRET is not configured");
  }

  const decodedToken = jwt.verify(token, tokenSecret);
  if (
    typeof decodedToken !== "object" ||
    decodedToken === null ||
    typeof decodedToken.id !== "string"
  ) {
    throw new Error("Invalid authentication token");
  }

  return decodedToken.id;
};
