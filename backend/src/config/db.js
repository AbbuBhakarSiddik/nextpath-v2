// backend/src/config/db.js
// NextPath.ai — PostgreSQL Database Client (Prisma ORM)

import { PrismaClient } from "@prisma/client";

let prismaInstance = null;
let isConnected = false;

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "⚠️ [Database] DATABASE_URL is not set in environment. Set DATABASE_URL to your PostgreSQL connection string."
    );
    return null;
  }

  if (!prismaInstance) {
    try {
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    } catch (err) {
      console.error("❌ Failed to initialize PrismaClient:", err.message);
      return null;
    }
  }

  return prismaInstance;
}

export async function connectDatabase() {
  const client = getPrismaClient();
  if (!client) return false;

  try {
    await client.$connect();
    isConnected = true;
    console.log("✅ PostgreSQL connected via Prisma");
    return true;
  } catch (err) {
    console.warn(
      `⚠️ PostgreSQL connection note: ${err.message}. (Ensure PostgreSQL is running or verify DATABASE_URL)`
    );
    return false;
  }
}

export const isDbConnected = () => isConnected;

export default getPrismaClient;
