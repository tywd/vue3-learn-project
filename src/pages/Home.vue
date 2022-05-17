<template>
  <div>
    <h1>这是首页</h1>
    <!-- <TodoList /> -->
    <!-- <TodoListV2 /> -->
    <!-- <Add /> -->
    <!-- <Count /> -->
    <!-- <div class="gong">🐓🐓🐓</div> -->
    <br>
    <!-- <Foo /> -->
    <!-- <TestDirectives /> -->
    <router-link to="/test-request-cancel">TestRequestCancel</router-link>
  </div>
</template>

<script setup>
import {reactive,onMounted }from 'vue'
import TodoList from '../components/TodoList.vue'
// import TodoListV2 from "../components/TodolistV2.vue";
// import Add from "../components/Add.vue";
import Count from '../components/Count.vue'
import Foo from '../components/Foo';
import TestDirectives from 'components/TestDirectives.vue';

const obj = reactive({a:1})

onMounted(() => {
  console.log('obj: ', obj);
  obj.a++
  console.log('obj++: ', obj);
})

</script>
