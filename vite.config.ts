import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      // 配置项
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用压缩
      threshold: 10240, // 文件大小超过此值时进行压缩，单位为字节
      algorithm: "gzip", // 压缩算法，可选 'gzip' 或 'brotli'
      ext: ".gz", // 压缩后的文件扩展名
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        //  sass-loader10+版本用additionalData
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixin.scss";
        `,
      },
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    proxy: {
      "/api": {
        //配置需要代理的路径，意思是代理http://localhost:8080/api/后的所有路由
        target: "http://localhost:8080/api",
        changeOrigin: true, //允许跨域
        ws: true, //允许websocket代理
        //重写路径，作用与vue配置pathRewrite作用相同
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
