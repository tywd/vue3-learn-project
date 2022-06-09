import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import {
  message,
  notification
} from 'ant-design-vue'
// 导⼊图标库
import * as Icons from '@ant-design/icons-vue'
import vDirectives from 'utils/directives.js'

const app = createApp(App)
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification
// 开始使⽤全局图标
const icons = Icons
for (const i in icons) {
  app.component(i, icons[i]) // 循环注册组件
}

for (const i in vDirectives) {
  /* // 注册一个全局自定义指令 `v-focus`
  app.directive('focus', vFocus)
  // v-debounce 按钮防抖，预防发起请求过于频繁
  app.directive('debounce', vDebounceClick) */
  console.log('vDirectives: ', vDirectives[i])
  console.log('i: ', i)
  app.directive(i, vDirectives[i])
}

app.use(store).use(router)
app.mount('#app')
