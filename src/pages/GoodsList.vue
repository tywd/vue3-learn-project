<!--
 * @Author: tywd
 * @Date: 2022-05-05 22:50:40
 * @LastEditors: tywd
 * @LastEditTime: 2022-05-10 11:53:28
 * @FilePath: /vue3-learn-project/src/pages/GoodsList.vue
 * @Description: Do not edit
-->
<template>
  <h1>这是商品列表页</h1>
  <div class="goods-list-container">
    <VirtualList
      :listData="state.goodsList"
      :itemSize="100"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, effect, toRefs, onMounted } from 'vue'
import { goodsQuery } from '@/api'
import VirtualList from 'components/VirtualList.vue'
import VirtualList2 from 'components/VirtualList.vue'
import defaultImg from '@/assets/gouku.jpg'
const state = reactive({
  page: 1,
  size: 10,
  totalSize: 0,
  goodsList: [],
})
const getList = () => {
  goodsQuery({ page: 1, size: 3470 }).then((res) => {
    state.goodsList = res.list
    state.totalSize = res.totalSize
  })
}
const defaultImgError = (e) => {
  e.target.src = defaultImg
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.goods-list-container {
  margin: 0 auto;
  width: 350px;
  overflow-y: auto;
}
</style>
