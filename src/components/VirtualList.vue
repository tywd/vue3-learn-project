<template>
  <div
    class="list-con"
    ref="listContanier"
    @scroll="scrollEvent($event)"
  >
    <div
      class="list-phantom"
      :style="{ height: listHeight + 'px' }"
    ></div>
    <div
      class="list"
      :style="{ transform: getTransform }"
    >
      <div
        class="list-item"
        v-for="item in trueData"
        :key="item.id"
        :style="{ height: itemSize + 'px'}"
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
    default: () => [],
  },
  //每项高度
  itemSize: {
    type: Number,
    default: 100,
  },
})
const listContanier = ref(null)
const state = reactive({
  page: 1,
  size: 10,
  totalSize: 0,
  goodsList: computed(() => props.listData),
  screenHeight: 800, //可视区域高度
  startOffset: 0, //偏移量
  start: 0, //起始索引
  end: 4, //结束索引
  visibleCount: computed(() => Math.ceil(state.screenHeight / props.itemSize)), //可显示的列表项数
})
const defaultImgError = (e) => {
  e.target.src = defaultImg
}
//列表总高度
let listHeight = computed(() => state.goodsList.length * props.itemSize)
//偏移量对应的style
let getTransform = computed(() => `translate3d(0,${state.startOffset}px,0)`)
//获取真实显示列表数据
let trueData = computed(() => {
  return state.goodsList.slice(
    state.start,
    Math.min(state.end, state.goodsList.length)
  )
})

let skeletonData = computed(() => {
  let list = [{ id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }]
  return list
})

const scrollEvent = () => {
  //当前滚动位置
  let scrollTop = listContanier.value.scrollTop
  //此时的开始索引
  state.start = Math.floor(scrollTop / props.itemSize)
  //此时的结束索引
  // let visibleCount = Math.ceil(state.screenHeight / props.itemSize)
  state.end = state.start + state.visibleCount
  //此时的偏移量
  state.startOffset = scrollTop - (scrollTop % props.itemSize)
}

onMounted(() => {
  state.start = 0
  state.end = state.start + state.visibleCount
  console.log('state.end: ', state.end)
  console.log('trueData: ', trueData)
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
    height: 500px;
    left: 0;
    right: 0;
    top: 0;
    position: absolute;

    .list-item {
      width: inherit;
      height: 100px;
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
