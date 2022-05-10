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
  <div class="list">
    <VirtualList
      :listData="state.goodsList"
      :size="300"
    />
    <!-- <div class="list-con">
      <div
        class="list-item"
        v-for="item in state.goodsList"
      >
        <div class="list-left">
          <img
            :src="item.url"
            alt=""
            v-on:error.once="defaultImgError($event)"
          >
        </div>
        <div class="list-right">
          <header class="list-head">{{item.title}}</header>
          <main class="list-main">{{item.price}}</main>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, effect, toRefs, onMounted } from 'vue'
import { goodsQuery } from 'api/'
import VirtualList from 'components/VirtualList.vue'
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
//列表总高度
// let listHeight = computed(() => {
//   return this.listData.length * this.itemSize
// })
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.list {
  margin: 0 auto;
  width: 350px;
  height: 500px;
  overflow-y: auto;

  .list-item {
    width: inherit;
    height: 100px;
    border-bottom: 1px solid #ddd;
    @include myflex($align: center, $justify: start);

    .list-left {
      width: 100px;
      height: inherit;
      img {
        width: inherit;
        height: inherit;
        object-fit: cover;
      }
    }
    .list-right {
      width: 200px;
      height: inherit;
      @include myflex($align: top, $justify: start, $direction: column);
    }
  }
}
</style>
