<!--
 * @Author: scy
 * @Date: 2022-04-12 17:59:52
 * @LastEditors: scy
 * @LastEditTime: 2022-04-12 18:03:05
 * @FilePath: /vue3-learn-project/src/components/TodoListV2.vue
 * @Description: 
-->
<template>
  <div>
    <input type="text" v-model="title" @keydown.enter="addTodo" />
    <button v-if="all > 0" @click="clear">清理</button>
    <ul v-if="todos.length">
      <li v-for="(todo, index) in todos" :key="index">
        <input type="checkbox" v-model="todo.done" :id="index" />
        <label :for="index">
          <span :class="{ done: todo.done }"> {{ todo.title }}</span>
        </label>
      </li>
    </ul>
    <div v-else>暂无数据</div>
    <div v-if="all !== 0">
      全选<input type="checkbox" v-model="allDone" />
      <span> {{ active }} / {{ all }} </span>
    </div>

    <button @click="loading">change icon</button>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
// import { useMouse } from "utils";
import { useFavicon, useMouse } from 'utils'
let { favicon } = useFavicon()
function loading() {
  favicon.value = '/icon-more@3x.png'
}
let { x, y } = useMouse()
let { title, todos, active, all, allDone, addTodo, clear } = useTodos()

function useTodos() {
  let title = ref('')
  //   let todos = ref([{ title: "学习Vue", done: false }]);
  let todos = ref(JSON.parse(localStorage.getItem('todos') || '[]'))

  watchEffect(() => {
    // watchEffect可以自动收集依赖，不需要指定监听的属性
    localStorage.setItem('todos', JSON.stringify(todos.value))
    console.log('todos.value: ', todos.value)
  })

  function addTodo() {
    todos.value.push({ title: title.value, done: false })
    title.value = ''
  }
  function clear() {
    if (active.value <= 0) {
      alert('请至少选中1个')
      return
    }
    todos.value = todos.value.filter((v) => !v.done)
  }
  let active = computed(() => {
    return todos.value.filter((v) => v.done).length
  })
  let all = computed(() => todos.value.length)
  let allDone = computed({
    get: function () {
      return active.value === all.value
    },
    set: function (value) {
      todos.value.forEach((todo) => {
        todo.done = value
      })
    },
  })
  return { title, todos, active, all, allDone, addTodo, clear }
}
</script>

<style>
h1 {
  color: red;
}
.done {
  color: red;
}
</style>
