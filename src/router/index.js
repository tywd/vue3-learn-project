import {
    createRouter,
    createWebHashHistory
} from 'vue-router' // createRouter 用来新建路由实例， createWebHashHistory 用来配置我们内部使用 hash 模式的路由，也就是 url 上会通过 # 来区分。
// import { createRouter, createWebHashHistory} from './grouter/index'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Test from '../pages/Test.vue'
import TestEffect from '../pages/TestEffect.vue'
import TestReactive from '../pages/TestReactive.vue'
import TestSlot from '../pages/TestSlot.vue'
import UploadFile from '../pages/UploadFile.vue'
import GoodsList from '../pages/GoodsList.vue'
import TestRequestCancel from '../pages/TestRequestCancel.vue'

const routes = [{
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
    },
    {
        path: '/test-effect',
        name: 'TestEffect',
        component: TestEffect
    },
    {
        path: '/test-reactive',
        name: 'TestReactive',
        component: TestReactive
    },
    {
        path: '/test-slot',
        name: 'TestSlot',
        component: TestSlot
    },
    {
        path: '/goods-list',
        name: 'GoodsList',
        component: GoodsList
    },
    {
        path: '/upload-file',
        name: 'UploadFile',
        component: UploadFile
    },

    {
        path: '/test-request-cancel',
        name: 'TestRequestCancel',
        component: TestRequestCancel
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router