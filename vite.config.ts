import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
    logLevel: 'error',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@data': resolve(__dirname, './data'),  
        },
    },
});

