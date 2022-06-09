<template>
  <div>
    <slot name="header" :value="'slot-header'" />
    <img
      :src="goukuImg"
      alt=""
      @click="add"
    >
    <slot name="footer">默认footer</slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import goukuImg from '../assets/gouku.jpg'
const count = ref(1)
const color = ref('red')
const emit = defineEmits(['notice-add'])
function add () {
  count.value++
  color.value = Math.random() > 0.5 ? 'blue' : 'red'
  emit('notice-add', count.value)
}
</script>

<style scoped>
</style>
