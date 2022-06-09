import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite' // 自动导入UI
// 支持vue, vue-router, vue-i18n, @vueuse/head, @vueuse/core等自动引入
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite' // 自动导入Vue的hooks
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
} from 'vite-plugin-style-import' // 自动导入非组件模块的样式，入弹窗提示andDesign的message
import path from 'path'

import eslintPlugin from 'vite-plugin-eslint'

const {
  getThemeVariables
} = require('ant-design-vue/dist/theme');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // your plugin installation
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    }),
    /* AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      // dts: 'src/auto-import.d.ts'
    }), */
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
      ],
      libs: [
        // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          },
        },
      ],
    }),

    // vite eslint
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
      exclude: ['src/static/*.js'], // default node_modules
      cache: false
    })
  ],
  // 1. If you are using the ant-design series, you need to configure this
  // 2. Make sure less is installed in the dependency `yarn add less -D`
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        /* modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        }, */
        modifyVars: getThemeVariables({
          dark: true, // 开启暗黑模式
        }),
      },
      scss: {
        additionalData: `@import "@/styles/index.scss";`
      }
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "api": path.resolve(__dirname, "src/api"),
      "components": path.resolve(__dirname, "src/components"),
      "utils": path.resolve(__dirname, "src/utils"),
    }
  },
  server: {
    port: 3000, //启动端口
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9111', //实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    cors: true
  }
})
