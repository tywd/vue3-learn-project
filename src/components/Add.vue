<template>
  <div>
    <h1><button @click="add">+</button>{{ count }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
let count = ref(1)
let color = ref('red')
const emit = defineEmits(['notice-add'])
function add() {
  count.value++
  color.value = Math.random() > 0.5 ? 'blue' : 'red'
  emit('notice-add', count.value)
}
</script>

<style scoped>
h1 {
  color: v-bind(color); /* 直接使用js中的变量 */
}
</style>