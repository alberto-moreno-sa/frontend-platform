import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      exclude: [
        "src/**/*.test.tsx",
        "src/**/*.test.ts",
        "src/**/*.stories.tsx",
        "src/setup-tests.ts",
      ],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        button: resolve(__dirname, "src/button/index.ts"),
        input: resolve(__dirname, "src/input/index.ts"),
        textarea: resolve(__dirname, "src/textarea/index.ts"),
        "input-group": resolve(__dirname, "src/input-group/index.ts"),
        card: resolve(__dirname, "src/card/index.ts"),
        modal: resolve(__dirname, "src/modal/index.ts"),
        badge: resolve(__dirname, "src/badge/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@ui-kit/utils",
        "class-variance-authority",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    cssCodeSplit: false,
  },
});
