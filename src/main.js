import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import { message,notification } from 'ant-design-vue'

const app = createApp(App)
app.config.globalProperties.$message = message;
app.config.globalProperties.$notification = notification;
app.use(store).use(router).mount('#app')

