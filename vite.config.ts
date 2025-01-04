import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
