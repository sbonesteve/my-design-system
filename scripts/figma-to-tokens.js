// scripts/figma-to-tokens.js
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Remplacez ces valeurs par vos propres informations Figma
const FIGMA_FILE_KEY = "YOUR_FIGMA_FILE_KEY";
const FIGMA_TOKEN = "YOUR_FIGMA_TOKEN";

const TOKENS_DIR = path.resolve(__dirname, "../src/css/tokens");

async function getFigmaFile() {
  const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN,
    },
  });

  return response.json();
}

async function processColors(figmaData) {
  const colorStyles = figmaData.styles
    .filter((style) => style.styleType === "FILL")
    .reduce((acc, style) => {
      // Chercher le nœud qui contient ce style
      const node = findNodeWithStyle(figmaData.document, style.id);
      if (node && node.fills && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === "SOLID") {
          const { r, g, b } = fill.color;
          const rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
          const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

          // Convertir le nom du style de Figma à un format snake_case
          const name = style.name.toLowerCase().replace(/\s+/g, "-");
          acc[name] = hex;
        }
      }
      return acc;
    }, {});

  // Générer le contenu du fichier SCSS
  let scssContent = `$colors: (\n`;
  Object.entries(colorStyles).forEach(([name, value]) => {
    scssContent += `  '${name}': ${value},\n`;
  });
  scssContent += `);`;

  await fs.writeFile(path.join(TOKENS_DIR, "_colors.scss"), scssContent);
  console.log("✅ Colors tokens successfully generated");
}

// Utilitaire pour trouver un nœud avec un style spécifique dans l'arbre Figma
function findNodeWithStyle(node, styleId) {
  if (node.styles && Object.values(node.styles).includes(styleId)) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const result = findNodeWithStyle(child, styleId);
      if (result) return result;
    }
  }

  return null;
}

// Convertir RGB en HEX
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

async function main() {
  try {
    // Assurez-vous que le répertoire des tokens existe
    await fs.mkdir(TOKENS_DIR, { recursive: true });

    console.log("Fetching Figma file...");
    const figmaData = await getFigmaFile();

    console.log("Processing colors...");
    await processColors(figmaData);

    // Vous pouvez ajouter d'autres fonctions pour extraire les typographies,
    // espacements, etc.

    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
