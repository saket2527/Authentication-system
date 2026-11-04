import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;
let connectionPromise: Promise<typeof mongoose> | undefined;

export async function connect() {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri);
  }

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}
