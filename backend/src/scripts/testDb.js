// backend/src/scripts/testDb.js
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";

async function testDatabase() {
  console.log("\n=======================================================");
  console.log("    NextPath.ai — Supabase PostgreSQL Database Test    ");
  console.log("=======================================================\n");

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not defined in backend/.env");
    console.log("   👉 Please set DATABASE_URL in backend/.env to your Supabase PostgreSQL URL.");
    process.exit(1);
  }

  // Parse and display connection target safely
  try {
    const urlObj = new URL(dbUrl.replace(/^postgresql:\/\//, "http://").replace(/^postgres:\/\//, "http://"));
    console.log(`📡 Connecting to Supabase Host: ${urlObj.hostname}:${urlObj.port || "5432"}`);
    console.log(`🗄️  Database: ${urlObj.pathname.replace(/^\//, "")}`);
    console.log(`👤 User: ${urlObj.username}`);
  } catch (_) {}

  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
    log: ["error"],
  });

  const start = Date.now();
  try {
    // 1. Handshake & query ping
    await prisma.$queryRaw`SELECT 1 as connected`;
    const latency = Date.now() - start;
    console.log(`\n✅ PostgreSQL Connected successfully! Ping latency: ${latency}ms`);

    // 2. Query table counts
    const [quizCount, profileCount, roadmapCount, activityCount, bugCount] = await Promise.all([
      prisma.quizScore.count(),
      prisma.profile.count(),
      prisma.careerRoadmap.count(),
      prisma.aiActivity.count(),
      prisma.bugReport.count(),
    ]);

    console.log("\n📊 Active Database Tables Status:");
    console.log(`   • Quiz Scores (Leaderboard): ${quizCount} records`);
    console.log(`   • Developer Profiles:        ${profileCount} records`);
    console.log(`   • Career Roadmaps:           ${roadmapCount} records`);
    console.log(`   • AI Activities (Logs):       ${activityCount} records`);
    console.log(`   • Bug Reports:               ${bugCount} records`);

    console.log("\n=======================================================");
    console.log("🎉 Database Status: 100% HEALTHY, CONNECTED & READY!");
    console.log("=======================================================\n");

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Database query failed (${Date.now() - start}ms):`, err.message);
    console.log("\n=======================================================");
    console.log("⚠️  Troubleshooting: Verify your password and URL encoding.");
    console.log("=======================================================\n");
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

testDatabase();
