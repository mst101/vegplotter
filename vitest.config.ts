import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
// import viteConfig from './vite.config';
import laravel from 'laravel-vite-plugin';

export default mergeConfig(
    // viteConfig,
    defineConfig({
        plugins: [
            laravel({
                input: 'resources/js/app.ts',
                ssr: 'resources/js/ssr.ts',
                refresh: true,
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                    compilerOptions: {
                        isCustomElement: tag => tag.startsWith('v-'),
                    },
                },
            }),
        ],
    }),
    defineConfig({
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root: fileURLToPath(new URL('./', import.meta.url)),
        },
    }),
);
