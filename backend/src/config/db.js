// backend/src/config/db.js
// NextPath.ai — PostgreSQL Database Client (Prisma ORM)
import { PrismaClient } from "@prisma/client";

let prismaInstance = null;
let isConnected = false;

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ [Database] DATABASE_URL is not set in environment.");
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

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    isConnected = true;
    console.log("✅ Supabase PostgreSQL connected via Prisma");
    return true;
  } catch (err) {
    console.warn(`⚠️ PostgreSQL connection note: ${err.message}`);
    return false;
  }
}

export const isDbConnected = () => isConnected;

export default prisma;
