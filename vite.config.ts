import path from "path"
import { defineConfig } from "vite";
// import tailwindcss from 'tailwindcss';
import react from "@vitejs/plugin-react";
import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  build: {
    // right now we disable minification to make it easier to debug what's happening
    minify: false,
  },
  plugins: [
    svgr(),
    react(),
    crx({ manifest: manifest as unknown as ManifestV3Export }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
