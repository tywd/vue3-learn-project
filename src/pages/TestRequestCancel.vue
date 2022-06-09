<!--
 * @Author: tywd
 * @Date: 2022-05-17 16:14:06
 * @LastEditors: tywd
 * @LastEditTime: 2022-06-09 16:11:48
 * @FilePath: /vue3-learn-project/src/pages/TestRequestCancel.vue
 * @Description: Do not edit
-->
<template>
  <div>
    <h1>这是测试重复请求取消上一次请求的测试</h1>
    <a-button
      type="button"
      @click="reque"
    >
      测试重复请求
    </a-button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { goodsQuery } from '@/api'
const state = reactive({
  page: 1,
  size: 10,
  totalSize: 0,
  goodsList: []
})
const reque = () => {
  goodsQuery({ page: 1, size: 10 })
    .then((res) => {
      console.log('res: ', res)
      state.goodsList = res.list
      state.totalSize = res.totalSize
    })
    .catch((error) => {
      console.log('goodsQuery-ttttt', error)
    })
}
</script>
