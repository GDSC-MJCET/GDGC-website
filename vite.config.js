import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import galleryEditor from "./scripts/vite-gallery-editor.mjs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), galleryEditor()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})