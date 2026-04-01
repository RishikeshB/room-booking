import mongoose from "mongoose";

declare global {
  var mongooseCache:
    | {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    }
    | undefined;
}

const mongoUri = process.env.MONGODB_URI ?? "";

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured");
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null
};

global.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      autoIndex: true
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

