import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vitePluginRequire from 'vite-plugin-require';
import Components from 'unplugin-vue-components/vite';
// vant插件
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { viteVConsole } from 'vite-plugin-vconsole';
import * as path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

function resolve(dir) {
    return path.join(__dirname, dir);
}

export default ({ mode }) => {
    console.log('---mode---', mode);
    const envFiles = [
        /** mode file */
        `.env.${mode}`
    ];

    for (const file of envFiles) {
        const envConfig = dotenv.parse(fs.readFileSync(file));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }

    return defineConfig({
        base: process.env.PUBLIC_PATH,
        plugins: [
            vue(),
            Components({
                resolvers: [VantResolver()]
            }),
            viteVConsole({
                entry: resolve('src/main.cjs'),
                enabled: mode === 'test' || mode === 'dev',
                config: {
                    maxLogNumber: 1000,
                    theme: 'dark'
                }
            }),
            vitePluginRequire()
        ],
        resolve: {
            alias: {
                '@': resolve('src'),
                '@c': resolve('src/components'),
                '@u': resolve('src/utils'),
                '@r': resolve('src/router')
            }
        },
        server: {
            host: '0.0.0.0',
            open: true,
            proxy: {
                '/proxy': {
                    target: process.env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/proxy/, '')
                }
            }
        }
    });
};
