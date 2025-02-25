import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Importer tous les composants React
import * as ReactComponents from "../src/react/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildWebComponentsFromReact() {
  const distDir = path.resolve(__dirname, "../dist/web-components");
  const srcDir = path.resolve(__dirname, "../src/web-components/wrappers");

  // Créer les répertoires si nécessaires
  await fs.mkdir(distDir, { recursive: true });
  await fs.mkdir(srcDir, { recursive: true });

  // Générer un wrapper pour chaque composant React
  const imports = [];
  const registers = [];
  const exportStatements = [];

  for (const [name, Component] of Object.entries(ReactComponents)) {
    // Nom kebab-case pour le custom element
    const elementName = `ds-${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;

    // Contenu du wrapper
    const wrapperContent = `
import React from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { ${name} } from '../../react/index.js';

const ${name}Element = reactToWebComponent(${name}, React, ReactDOM, {
  shadow: true,
  props: ${JSON.stringify(getComponentProps(Component))}
});

export default ${name}Element;
`;

    // Écrire le fichier wrapper
    const wrapperPath = path.join(srcDir, `${name}Wrapper.js`);
    await fs.writeFile(wrapperPath, wrapperContent);

    // Ajouter à l'index
    imports.push(`import ${name}Element from './wrappers/${name}Wrapper.js';`);
    registers.push(`customElements.define('${elementName}', ${name}Element);`);
    exportStatements.push(`export { ${name}Element };`);
  }

  // Générer l'index des Web Components
  const indexContent = `
${imports.join("\n")}

// Enregistrer tous les composants comme Custom Elements
${registers.join("\n")}

// Exporter tous les éléments
${exportStatements.join("\n")}
`;

  await fs.writeFile(path.join(path.resolve(__dirname, "../src/web-components"), "index.js"), indexContent);

  console.log("Web Components generated from React components successfully!");
}

// Utilitaire pour extraire les props d'un composant React
function getComponentProps(Component) {
  // Si le composant a des propTypes, les utiliser
  if (Component.propTypes) {
    return Object.keys(Component.propTypes);
  }

  // Sinon, retourner quelques props standard
  return ["className", "style", "id"];
}

buildWebComponentsFromReact();
