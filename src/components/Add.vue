<template>
  <div>
    <h1><button @click="add">+</button>{{ count }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
let count = ref(1)
let color = ref('red')
function add() {
  count.value++
  color.value = Math.random() > 0.5 ? 'blue' : 'red'
}
</script>

<style scoped>
h1 {
  color: v-bind(color); /* 直接使用js中的变量 */
}
</style>
>
