import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
