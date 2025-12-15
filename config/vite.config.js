import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/BumsOnSeats/',
    root: path.resolve(__dirname, '../src/html'),
    publicDir: path.resolve(__dirname, '../public'),
    plugins: [
        TanStackRouterVite({
            routesDirectory: path.resolve(__dirname, '../src/routes'),
            generatedRouteTree: path.resolve(__dirname, '../src/routeTree.gen.ts'),
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@lib': path.resolve(__dirname, '../src/lib'),
            '@routes': path.resolve(__dirname, '../src/routes'),
            '@style': path.resolve(__dirname, '../src/style'),
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
