<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "./components/HelloWorld.vue";
import { message } from 'ant-design-vue'
</script>

<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Hello Vue 3 + Vite TYWD" /> -->
    <router-link to="/">首页</router-link> |
    <!-- <router-link to="/about">关于</router-link> | -->
    <router-link to="/test">Test</router-link> |
    <router-link to="/goods-list">GoodsList</router-link> |
    <router-link to="/upload-file">文件上传</router-link> |
    <!-- <router-link to="/ty">天宇无敌</router-link> -->
    <router-view></router-view>
    <!-- <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view> -->
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
