<template>
  <div>
    <h1><button @click="add">+</button>{{ count }}</h1>
    <input type="text">
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const count = ref(1)
const emit = defineEmits(['addTest'])
function add () {
  count.value++
  console.log('count.value: ', count.value)
  emit('addTest', count.value)
}
</script>

<style scoped>
</style>
