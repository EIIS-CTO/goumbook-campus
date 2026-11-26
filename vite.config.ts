import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Pubblicato su GitHub Pages in eiis-cto.github.io/goumbook-campus/
export default defineConfig({
  base: "/goumbook-campus/",
  plugins: [react(), tailwindcss()],
});
