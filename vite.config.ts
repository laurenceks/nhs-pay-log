import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import TanStackRouterVite from "@tanstack/router-plugin/vite";

console.log("Config loaded");
export default defineConfig({
    root: "src/client/",
    base: "/",
    plugins: [
        TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
        react(),
        viteTsconfigPaths(),
    ],
    build: {
        outDir: "../../dist/client",
        emptyOutDir: true,
    },
    resolve: {
        alias: [{ find: "node_modules", replacement: "node_modules" }],
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },
});
