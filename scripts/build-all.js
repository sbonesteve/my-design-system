import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function buildAll() {
  try {
    console.log("Building React components...");
    await execPromise("node scripts/build-react.js");

    console.log("Building Web Components...");
    await execPromise("node scripts/build-wc.js");

    console.log("All builds completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildAll();
