import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  // depending on your application, base can also be "/"
  root: "src/client/",
  base: "",
  plugins: [react(), viteTsconfigPaths()],
  build: {
    outDir: "../../dist/client",
    emptyOutDir: true,
  },
  resolve: {
    alias: [{ find: "node_modules", replacement: "node_modules" }],
  },
  // server: {
  //   // this ensures that the browser opens upon server start
  //   open: true,
  //   proxy: {
  //     // this allows localhost api calls
  //     "/api": {
  //       target: "http://localhost:5000",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
