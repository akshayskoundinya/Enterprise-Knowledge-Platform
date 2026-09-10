import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/roles": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/documents": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/retrieval": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});