import path from "path";

// plugins
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";
import url from "@rollup/plugin-url";

export function defaultInputOptions({ buildDirectory, tmpDir }) {
  return {
    plugins: [
      resolve({ browser: true }),
      styles({
        mode: ["extract"],
        autoModules: (id) => id.includes(".module.css"),
        minimize: true,
        sourceMap: true,
      }),
      url({
        include: "**/*",
        exclude: "**/*.(js|json|css)",
        destDir: path.resolve(tmpDir),
        sourceDir: path.resolve(buildDirectory),
        limit: 0, // extract all files
        fileName: "[dirname]/[name]-[hash][extname]",
      }),
      commonjs(),
    ],
  };
}

export function defaultOutputOptions(buildDirectory) {
  return {
    format: "es",
    plugins: [terser()],
    manualChunks: (id) => {
      if (id.includes("web_modules")) {
        return path.parse(id).name;
      }
    },
    assetFileNames: "css/[name]-[hash].[ext]",
    chunkFileNames: "chunks/[name]-[hash].chunk.js",
    compact: true,
    sourcemap: true,
    entryFileNames: "[name]-[hash].js",
    dir: buildDirectory,
  };
}
