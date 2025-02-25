import { build } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildReact() {
  await build({
    configFile: path.resolve(__dirname, "../vite.config.js"),
    build: {
      lib: {
        entry: path.resolve(__dirname, "../src/react/index.js"),
        formats: ["es", "cjs"],
        fileName: (format) => `react.${format}.js`,
      },
      outDir: "dist/react",
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
      emptyOutDir: true,
    },
  });
}

buildReact();
