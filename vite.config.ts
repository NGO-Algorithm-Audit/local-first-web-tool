import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: ['pyodide'],
    },
    plugins: [TanStackRouterVite(), viteReact(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    worker: {
        format: 'es',
    },
});
