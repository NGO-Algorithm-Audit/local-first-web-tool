import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import viteReact from '@vitejs/plugin-react';

const { resolve } = path;
const root = resolve(__dirname, 'src');
const dist = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
    root,
    publicDir: resolve(__dirname, 'public'), // This tells Vite where to find the public folder
    optimizeDeps: {
        exclude: ['pyodide'],
    },
    plugins: [viteReact(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: dist,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                biasDetection: resolve(root, 'bias-detection.html'),
            },
        },
    },
    worker: {
        format: 'es',
    },
});
