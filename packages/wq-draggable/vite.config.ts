
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// vite-plugin-css-injected-by-js 是一个 Vite 插件，它的主要功能是将 CSS 代码通过 JavaScript 注入到页面中。
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    plugins: [
        vue(),

        cssInjectedByJsPlugin()

        // VitePluginStyleInject('wq-draggable')
    ],
    build: {
        //打包文件目录
        outDir: "es",
        //压缩
        //minify: false,
        rollupOptions: {
            //忽略打包vue文件
            external: ["vue"],
            input: ["./src/index.ts"],
            output: [
                {
                    //打包格式
                    format: "es",
                    //打包后文件名
                    entryFileNames: "[name].mjs",
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    exports: "named",
                    //配置打包根目录
                    dir: "./dist/es",
                },
                {
                    //打包格式
                    format: "cjs",
                    //打包后文件名
                    entryFileNames: "[name].js",
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    exports: "named",
                    //配置打包根目录
                    dir: "./dist/lib",
                },
            ],
        },
        lib: {
            entry: "./src/index.ts",
        },
    },

})
