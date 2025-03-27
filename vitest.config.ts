import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        testTimeout: 20000,
        environment: "node",
        sequence: {
            hooks: "list",
        },
        include: ["test/**/*.{test,spec}.ts"],
    },
});
