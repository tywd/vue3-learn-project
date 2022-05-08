<template>
  <div class="list">
    <div class="list-con">
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
          <header class="list-head">{{item.title}}</header>
          <main class="list-main">{{item.price}}</main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, effect, toRefs, onMounted, watch } from 'vue'
import defaultImg from '@/assets/gouku.jpg'
/* export default {
  props: {
    listData: {
      type: Array,
      default: [],
    },
  },
  setup(_, { root, emit }) {
    const state = reactive({
      page: 1,
      size: 10,
      totalSize: 0,
      goodsList: computed(() => _.listData),
    })
    watch(
      () => state.goodsList,
      (val, oldVal) => {
        console.log('val: ', val)
      }
    )
    const defaultImgError = (e) => {
      e.target.src = defaultImg
    }
    //列表总高度
    // let listHeight = computed(() => {
    //   return this.listData.length * this.itemSize
    // })
    onMounted(() => {
      console.log('state.goodsList: ', state.goodsList)
    })

    return {
      defaultImgError,
      ...toRefs(state),
    }
  },
} */
const props = defineProps({
  listData: {
    type: Array,
    default: [],
  },
})
const state = reactive({
  page: 1,
  size: 10,
  totalSize: 0,
  goodsList: computed(() => props.listData),
})
watch(
  () => state.goodsList,
  (val, oldVal) => {
    console.log('val: ', val)
  }
)
const defaultImgError = (e) => {
  e.target.src = defaultImg
}
//列表总高度
// let listHeight = computed(() => {
//   return this.listData.length * this.itemSize
// })
onMounted(() => {
  console.log('state.goodsList: ', state.goodsList)
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
