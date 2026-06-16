import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` matches the GitHub Pages project path (https://<user>.github.io/bibletype/).
// Asset and data URLs use import.meta.env.BASE_URL so they respect this automatically.
export default defineConfig({
  base: "/bibletype/",
  plugins: [react()],
})
