<template>
  <div>
    <h1>这是商品列表页</h1>
  </div>
</template>

<script setup>
import { ref, reactive, computed, effect, toRefs, onMounted } from 'vue'
import { goodsQuery } from 'api/'
const getList = () => {
  goodsQuery({ page: 1, size: 10 }).then(res=>{
    console.log('res: ', res);
  })
}
onMounted(() => {
  getList()
})
</script>
