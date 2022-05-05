import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import { message,notification } from 'ant-design-vue'
// 导⼊图标库
import * as Icons from "@ant-design/icons-vue"

const app = createApp(App)
app.config.globalProperties.$message = message;
app.config.globalProperties.$notification = notification;
// 开始使⽤全局图标
const icons = Icons;
for (const i in icons) {
    app.component(i, icons[i]); // 循环注册组件
}

app.use(store).use(router)
app.mount('#app')