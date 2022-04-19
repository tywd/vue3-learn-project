<!--
 * @Author: tywd
 * @Date: 2022-04-18 21:41:32
 * @LastEditors: tywd
 * @LastEditTime: 2022-04-18 21:41:33
 * @FilePath: /vue3-learn-project/src/pages/TestEffect.vue
 * @Description: Do not edit
-->
<template>
  <div>
    <h1>这是TestEffect页面</h1>
    <h1><button @click="add">+</button>{{ num.currentNum }}</h1>
    <button @click="testStop">testStop</button>
    <button @click="testRunner">testRunner</button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, effect, stop } from 'vue'

let str = ref('ty')
let obj = reactive({
  count: 1,
})
let double = computed(() => obj.count * 2)
const num = reactive({ currentNum: 0 })

const runner = effect(
  () => {
    // 一开始就调用
    console.log('effect ', num.currentNum)
  },
  {
    scheduler: () => {
      // 一开始不会被调用，值变化后才会调用该方法而不调用上面方法，如果未设置则一直执行上面方法
      console.log('effect-scheduler ', num.currentNum)
    },
    /* onStop: () => {
      // 被stop后可调用一次
      console.log('effect 已被 stop')
    }, */
  }
)

function add() {
  num.currentNum++
}

function testStop() {
  stop(runner) // stop后除非执行 runner 否则 effect 将不会再执行
}

function testRunner() {
  runner()
}
</script>
