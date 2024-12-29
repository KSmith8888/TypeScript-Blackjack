import { defineConfig } from "vite";

export default defineConfig({
    base: "/TypeScript-Blackjack/",
    build: {
        target: "es2022",
        assetsInlineLimit: 0,
    },
});
