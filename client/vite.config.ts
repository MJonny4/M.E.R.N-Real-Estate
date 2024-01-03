import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@pages': '/src/pages',
            '@components': '/src/components',
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                secure: false,
            },
        },
    },
    build: {
        chunkSizeWarningLimit: 1600,
    },
});
