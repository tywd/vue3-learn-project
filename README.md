# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

# Vue3一些使用的新方法新特性
尤大推荐的神器`unplugin-vue-components`,解放双手，不需再手动引入组件
ui(Element-ui)库,vue hooks)
### unplugin-vue-components/vite
```js
// vite.config.js
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite' // 自动导入UI
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [
    vue(),
    // your plugin installation
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    }),
  ],
})
```
```js
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css'; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
```
### unplugin-auto-import/vite
与react的hooks类似
```js 
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite' // 自动导入Vue的hooks
export default defineConfig({
  plugins: [
    ...
    // 这些 自动导入Vue的hooks，刚入门vue3，建议暂时不加
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      // dts: 'src/auto-import.d.ts'
    })
  ],
})
```
引入前后对比
注意：引入后要配置 .eslintrc.js
```js
// 引入前
import { ref, computed } from 'vue'
const num = ref(0)
const double = computed(() => num.value * 2)

// 引入后
const num = ref(0)
const double = computed(() => num.value * 2)
```

### vite-plugin-style-import
由于`unplugin-vue-components/vite`此插件无法处理非组件模块，如 message，这种组件需要手动加载：\
参考ant-design-vue文档[按需加载](https://www.antdv.com/docs/vue/getting-started-cn/
#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)
引入方式参考[vite-plugin-style-import](https://github.com/vbenjs/vite-plugin-style-import)
完整写入如下
```js
npm i vite-plugin-style-import less -D
```
```js
// vite.config.js
import { createStyleImportPlugin, AndDesignVueResolve} from 'vite-plugin-style-import' // 自动导入非组件模块的样式，入弹窗提示andDesign的message
export default defineConfig({
  plugins: [
    ...
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
  ],
  // 1. If you are using the ant-design series, you need to configure this
  // 2. Make sure less is installed in the dependency `yarn add less -D`
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
```

# 引入ant-design-vue 主题
css里面添加即可
官方有样式文档[ant-design-vue主题色](https://www.antdv.com/docs/vue/customize-theme-cn)
```js
// vite.config.js
const { getThemeVariables } = require('ant-design-vue/dist/theme');
export default defineConfig({
  plugins: [],
  // 1. If you are using the ant-design series, you need to configure this
  // 2. Make sure less is installed in the dependency `yarn add less -D`
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
        /* modifyVars: getThemeVariables({
          dark: true, // 开启暗黑模式
        }), */
      },
    },
  },
})
```