import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (mode === 'production' && !env.VITE_API_URL) {
    throw new Error(
      '[env] VITE_API_URL is required for production builds. Set it to https://api.mipredict.com ' +
        '(Cloudflare Pages: Settings > Environment variables > Production > VITE_API_URL).'
    )
  }

  return {
    plugins: [react(), tailwindcss()]
  }
})