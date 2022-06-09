<template>
  <div>
    <h1>这是关于页面</h1>
    <h1><button @click="add">+</button>{{ obj.count }}</h1>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, effect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const str = ref('ty')
const obj = reactive({
  count: 1
})
const double = computed(() => obj.count * 2)

const num = reactive({ currentNum: 0 })

let changeValue

effect(() => {
  changeValue = num.currentNum;
  console.log('effect ', changeValue, num.currentNum)
  console.log('effect ', obj.count, double.value, str.value)
  // console.log('effect ', obj.count, str.value)
})

watchEffect(() => {
  // console.log('watchEffec：', changeValue, num.currentNum)
  // console.log('watchEffect：', obj.count, double.value, str.value)
})

onMounted(() => {
  console.log('route: ', router.currentRoute)
  console.log('router: ', router)
})

function add () {
  obj.count++
  // num.currentNum++
}
</script>
