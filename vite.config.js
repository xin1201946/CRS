import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {createHtmlPlugin} from 'vite-plugin-html';
import semi from "vite-plugin-semi-theme";
// https://vitejs.dev/config/
export default defineConfig({
  // 公共基础路径
  base: './',
  build: {
    // 生产环境构建文件的输出目录
    outDir: './dist',
    // 生产环境是否生成 sourceMap 文件
    sourcemap: true,
    // 启用br压缩
    brotliSize: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // 配置压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    // 服务器端口号
    port: 7001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // 后端运行端口
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    semi({
      theme: "@semi-bot/semi-theme-ccrsthemedefault",
    }),
    react(),
    createHtmlPlugin({
      minify: false, // 是否压缩 index.html 文件，这里选择不压缩
      pages: [
        {
          template: 'index.html',
          filename: 'index.html',
          injectOptions: {
            data: {
              buildTime: new Date().toLocaleString(), // 这里就是记录的当前打包的时间。前面的键位名称‘buildTime’需要和 index.html 文件中的相对应
            },
          },
        },
      ],
    }),
  ],
});