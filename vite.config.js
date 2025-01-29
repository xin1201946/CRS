import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html';
// https://vitejs.dev/config/
export default defineConfig({
  allowAsynchronousTasks: false,
  baseUrl: './',
  outputDir: './../flask-dist',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 服务器端口号
  devServer: {
    port: 7001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', //后端运行端口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  plugins: [
    react(),
    createHtmlPlugin({
      minify: false, // 是否压缩index.html文件，这里选择不压缩
      pages: [
        {

          template: 'index.html',
          filename: 'index.html',
          injectOptions: {
            data: {
              buildTime: new Date().toLocaleString() // 这里就是记录的当前打包的时间。前面的键位名称‘buildTime’需要个index.html文件中的相对应
            }
          }
        }
      ]
    })
  ],
})