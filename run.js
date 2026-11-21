// run.js — NextPath.ai Unified Development Runner
// Runs both backend and frontend concurrently with prefixed colored output.
// Zero external dependencies required.

import { spawn } from "child_process";
import process from "process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

console.log("\x1b[32m%s\x1b[0m", "=================================================");
console.log("\x1b[32m%s\x1b[0m", " 🚀 Starting NextPath.ai Platform (Dev Mode)");
console.log("\x1b[32m%s\x1b[0m", " - Backend API : http://localhost:5000");
console.log("\x1b[32m%s\x1b[0m", " - Frontend Web: http://localhost:3000");
console.log("\x1b[32m%s\x1b[0m", "=================================================\n");

function runService(name, color, cwd, script) {
  const child = spawn(npmCmd, ["run", script], {
    cwd,
    stdio: ["inherit", "pipe", "pipe"],
    shell: isWindows,
  });

  const prefix = `${color}[${name}]\x1b[0m `;

  child.stdout.on("data", (data) => {
    const lines = data.toString().split(/\r?\n/);
    lines.forEach((line) => {
      if (line.trim()) console.log(`${prefix}${line}`);
    });
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().split(/\r?\n/);
    lines.forEach((line) => {
      if (line.trim()) console.error(`${prefix}\x1b[31m${line}\x1b[0m`);
    });
  });

  child.on("close", (code) => {
    console.log(`${prefix}process exited with code ${code}`);
  });

  return child;
}

const backendProcess = runService("BACKEND", "\x1b[36m", "backend", "dev");
const frontendProcess = runService("FRONTEND", "\x1b[35m", "frontend", "start");

function cleanup() {
  console.log("\n\x1b[33mStopping all NextPath.ai services...\x1b[0m");
  try {
    if (isWindows) {
      if (backendProcess.pid) spawn("taskkill", ["/pid", backendProcess.pid, "/f", "/t"]);
      if (frontendProcess.pid) spawn("taskkill", ["/pid", frontendProcess.pid, "/f", "/t"]);
    } else {
      backendProcess.kill("SIGINT");
      frontendProcess.kill("SIGINT");
    }
  } catch (_) {}
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
