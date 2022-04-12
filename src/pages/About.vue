<template>
  <div>
    <h1>这是关于页面</h1>
    <h1><button @click="add">+</button>{{ obj.count }}</h1>
  </div>
</template>

<script setup>
import { reactive, computed, watchEffect } from 'vue'

let obj = reactive({
  count: 1,
})
let double = computed(() => obj.count * 2)
function add() {
  obj.count++
}

watchEffect(() => {
  console.log('数据被修改了', obj.count, double.value)
})
</script>
