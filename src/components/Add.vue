<template>
  <div>
    <h1><button @click="add">+</button>{{ count }}</h1>
  </div>
</template>

<script >
import { ref, onMounted, defineEmits } from 'vue'
export default {
  setup(props, { emit }) {
    let count = ref(1)
    let color = ref('red')
    // const emit = defineEmits(['notice-add'])
    function add() {
      count.value++
      color.value = Math.random() > 0.5 ? 'blue' : 'red'
      emit('notice-add', count.value)
    }

    return {
      count,
      color,
      add,
    }
  },
}

/* */

onMounted(() => {})
</script>

<style scoped>
h1 {
  color: v-bind(color); /* 直接使用js中的变量 */
}
</style>