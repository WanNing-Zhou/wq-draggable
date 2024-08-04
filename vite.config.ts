
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue()
    ],
    build: {
        target: 'modules',
        minify: true,
        lib: {
            entry: 'src/index',
            name: 'vue3-draggable',
            formats: ['es', 'cjs', 'umd']
        },
        rollupOptions: {
            // 忽略vue文件
            external: ['vue'],
            output: [{
                format: 'es',
                entryFileNames: '[name].js',
                preserveModules: true,
                dir: 'dist/es',
                globals: {
                    vue: 'Vue'
                }
            },
                {
                    format: 'cjs',
                    entryFileNames: '[name].js',
                    preserveModules: true,
                    dir: 'dist/lib',
                    preserveModulesRoot: 'src'
                }
            ],
        }
    }
})
