import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as sass from "sass";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
