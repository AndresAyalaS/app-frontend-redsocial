import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./jest.setup.ts",
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/node_modules/**",
        "**/tests/**",
        "**/*.d.ts",
        "src/routes/**",
        "tailwind.config.js",
        "vite.config.ts",
        "postcss.config.js",
        "jest.setup.ts",
        "src/index.tsx",
        "src/App.tsx",
        "src/main.tsx",
        "src/types/**",
      ],
    },
  },
});
