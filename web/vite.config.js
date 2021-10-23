import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  plugins: [
    reactRefresh({
      include: `${__dirname}/src/**/*`,
      exclude: [/node_modules/],
    }),
  ],
  server: {
    hmr: {
      port: 80,
      protocol: 'ws',
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
    sourcemap: process.env.NODE_ENV !== 'development',
  },
  define: {
    _global: {
      FOO: 'bar',
    },
  },
})
