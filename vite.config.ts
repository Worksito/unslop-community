import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Les composants 21st.dev importent "@/lib/utils" (shadcn) et parfois "next/link".
      // La vitrine n'est pas un projet Next : next/link y devient un simple lien.
      '@': src(''),
      'next/link': src('shims/next-link.tsx'),
    },
  },
})
