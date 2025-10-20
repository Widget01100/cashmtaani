import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// detect when building for GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGitHubPages ? '/cashmtaani/' : '/', // ✅ works locally & online
  plugins: [react()],
})
