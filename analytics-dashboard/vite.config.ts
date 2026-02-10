import { resolve } from "path";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
    },
    dedupe: ["react", "react-dom", "react-router"],
  },
  server: {
    port: 3000,
  },
});
