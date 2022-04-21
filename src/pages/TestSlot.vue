<template>
  <div>
    <h1>这是slot测试页</h1>
    <ComponentSlot>
      <template v-slot:header="{value}">
        <!-- 接收有名slot内部返回的值 -->
        <div class="header">header {{ value }}</div>
      </template>
      <template v-slot:footer="{value}">
        <div class="footer">footer</div>
      </template>
    </ComponentSlot>
  </div>
</template>

<script setup>
import ComponentSlot from '../components/ComponentSlot.vue'
</script>
