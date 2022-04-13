import { createRouter, createWebHashHistory } from 'vue-router' // createRouter 用来新建路由实例， createWebHashHistory 用来配置我们内部使用 hash 模式的路由，也就是 url 上会通过 # 来区分。
// import { createRouter, createWebHashHistory} from './grouter/index'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Test from '../pages/Test.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/test',
        name: 'Test',
        component: Test
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router