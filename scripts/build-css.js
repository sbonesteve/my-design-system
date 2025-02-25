// scripts/build-css.js
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import * as sass from "sass";

const execPromise = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildCSS() {
  const srcDir = path.resolve(__dirname, "../src/css");
  const outDir = path.resolve(__dirname, "../dist/css");

  try {
    // Créer le répertoire de sortie s'il n'existe pas
    await fs.mkdir(outDir, { recursive: true });

    // Compiler le fichier SCSS principal
    const result = sass.compile(path.join(srcDir, "main.scss"), {
      style: "expanded",
      sourceMap: true,
    });

    // Écrire le fichier CSS principal
    await fs.writeFile(path.join(outDir, "main.css"), result.css);
    await fs.writeFile(path.join(outDir, "main.css.map"), JSON.stringify(result.sourceMap));

    // Créer une version minifiée
    const minifiedResult = sass.compile(path.join(srcDir, "main.scss"), {
      style: "compressed",
    });

    await fs.writeFile(path.join(outDir, "main.min.css"), minifiedResult.css);

    console.log("CSS build completed successfully!");
  } catch (error) {
    console.error("CSS build failed:", error);
    throw error;
  }
}

buildCSS();
