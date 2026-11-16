import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

// Unit tests for server logic run in Node. Prompts are bundled as text by
// Wrangler; this mirrors that for tests.
export default defineConfig({
  plugins: [
    {
      name: "text-modules",
      load(id) {
        if (id.endsWith(".txt")) return `export default ${JSON.stringify(readFileSync(id, "utf8"))};`;
      },
    },
  ],
  test: { include: ["src/**/*.test.ts"] },
});
