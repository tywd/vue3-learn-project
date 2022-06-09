<!-- 定高的虚拟列表 -->
<template>
  <div
    ref="listContanier"
    class="list-con"
    :style="{ height: state.screenHeight + 'px'}"
    @scroll="scrollEvent($event)"
  >
    <div
      class="list-phantom"
      :style="{ height: listHeight + 'px' }"
    />
    <div
      class="list"
      :style="{ transform: getTransform }"
    >
      <div
        v-for="item in trueData"
        :key="item.id"
        class="list-item"
        :style="{ height: itemSize + 'px'}"
      >
        <div class="list-left">
          <img
            :src="item.url"
            alt=""
            @error.once="defaultImgError($event)"
          >
        </div>
        <div class="list-right">
          <header class="list-head">{{ item.title }}</header>
          <main class="list-main">{{ item.price }}</main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import defaultImg from '@/assets/gouku.jpg'

// vue + script setup 语法糖写法 不需用export default
// 使用export default 需要在setup 包住 最后还需return 暴露出所有需要用的值和方法
const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  // 每项高度
  itemSize: {
    type: Number,
    default: 80
  }
})
const listContanier = ref(null)
const state = reactive({
  page: 1,
  size: 10,
  totalSize: 0,
  goodsList: computed(() => props.listData),
  screenHeight: 600, // 可视区域高度
  startOffset: 0, // 偏移量
  start: 0, // 起始索引
  end: 4, // 结束索引
  visibleCount: computed(
    () => Math.ceil(state.screenHeight / props.itemSize) + 50
  ) // 可显示的列表项数 向上取整，此处可+多几个前后预渲染，不必等到滚动到了再渲染
})
const defaultImgError = (e) => {
  e.target.src = defaultImg
}
// 列表总高度
const listHeight = computed(() => state.goodsList.length * props.itemSize)
// 偏移量对应的style
const getTransform = computed(() => `translate3d(0,${state.startOffset}px,0)`)
// 获取真实显示列表数据
const trueData = computed(() => {
  return state.goodsList.slice(
    state.start,
    Math.min(state.end, state.goodsList.length)
  )
})

const scrollEvent = () => {
  // 当前滚动位置
  const scrollTop = listContanier.value.scrollTop
  console.log('scrollTop: ', scrollTop)
  // 此时的开始索引
  state.start = Math.floor(scrollTop / props.itemSize)
  // 此时的结束索引
  state.end = state.start + state.visibleCount
  // 此时的偏移量，由于我们默认可视区域是在顶部的，如果随着 虚拟滚动条 在滚动，这个可视区域就必须要有偏移量，才能有一个滚动一样的效果
  state.startOffset = scrollTop - (scrollTop % props.itemSize)
  // state.startOffset = scrollTop // 使用此偏移量 滑动时列表会有莫名的轻微抖动
}

onMounted(() => {
  state.start = 0
  state.end = state.start + state.visibleCount
})
</script>

<style lang="scss" scoped>
.list-con {
  height: 100%;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;

  .list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }
  .list {
    margin: 0 auto;
    width: 350px;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;

    .list-item {
      width: inherit;
      // height: 100;
      @include myflex($align: center, $justify: start);
      box-sizing: border-box;
      padding: 10px;
      color: #555;
      border-bottom: 1px solid #999;

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
        .list-head {
          width: 100%;
          height: 50px;
        }
        .list-main {
          width: 100%;
          height: 25px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
