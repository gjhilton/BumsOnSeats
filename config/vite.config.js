import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { plugin as markdown } from 'vite-plugin-markdown'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/BumsOnSeats/',
    root: path.resolve(__dirname, '../src/html'),
    publicDir: path.resolve(__dirname, '../public'),
    plugins: [
        react(),
        markdown({ mode: 'html' }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@lib': path.resolve(__dirname, '../src/lib'),
            '@routes': path.resolve(__dirname, '../src/routes'),
            '@style': path.resolve(__dirname, '../src/style'),
            '@content': path.resolve(__dirname, '../src/content'),
            '@generated': path.resolve(__dirname, '../styled-system'),
        },
    },
    server: {
        port: 8080,
        strictPort: true,
        host: true,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 8080,
        },
        fs: {
            allow: ['..'],
        },
    },
    build: {
        outDir: path.resolve(__dirname, '../dist'),
        emptyOutDir: true,
    },
})
