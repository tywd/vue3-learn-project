<!-- v3 写法 -->
<template>
  <div>
    <div class="count">{{ count }} *2 = {{ double }}</div>
    <button @click="add">add</button>
    <button @click="asyncAdd">async add</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
// import { useStore } from '../store/gvuex'
const store = useStore()
const count = computed(() => store.state.count)
const double = computed(() => store.getters.double)
function add () {
  store.commit('add')
}
function asyncAdd () {
  store.dispatch('asyncAdd')
}
</script>

<style scoped>
h1 {
  color: red;
}
.count {
  cursor: pointer;
}
</style>
