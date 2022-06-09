<!-- v3 写法 -->
<template>
  <div>
    <span class="dustbin"> 🗑 </span>
    <input v-model="title" type="text" @keydown.enter="addTodo">
    <button v-if="active < all" @click="clear">清理</button>
    <ul v-if="todos.length">
      <transition-group name="flip-list" tag="ul">
        <li v-for="(todo, index) in todos" :key="index">
          <input v-model="todo.done" type="checkbox">
          <span :class="{ done: todo.done }"> {{ todo.title }}</span>
          <span class="remove-btn" @click="removeTodo($event, i)"> ❌ </span>
        </li>
      </transition-group>
    </ul>
    <div v-else>暂无数据</div>
    <div>
      全选<input v-model="allDone" type="checkbox">
      <span> {{ active }} / {{ all }} </span>
    </div>
    <transition name="modal">
      <div v-if="showModal" class="info-wrapper">
        <div class="info">哥，你啥也没输入！</div>
      </div>
    </transition>
    <div class="animate-wrap">
      <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <div v-show="animate.show" class="animate">📋</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
// import { useMouse } from 'utils'
// const { x, y } = useMouse()
/* let title = ref("");
let todos = ref([{ title: "学习Vue", done: false }]);
function addTodo() {
  todos.value.push({ title: title.value, done: false });
  title.value = "";
}
function clear() {
  todos.value = todos.value.filter((v) => !v.done);
}
let active = computed(() => {
  return todos.value.filter((v) => !v.done).length;
});
let all = computed(() => todos.value.length);
let allDone = computed({
  get: function () {
    return active.value === 0;
  },
  set: function (value) {
    todos.value.forEach((todo) => {
      todo.done = value;
    });
  },
}); */

// const count = ref(1)
/* function add () {
  count.value++
} */

const {
  title,
  todos,
  showModal,
  addTodo,
  removeTodo,
  clear,
  active,
  all,
  allDone,
  animate,
  beforeEnter,
  enter,
  afterEnter
} = useTodos()

function useTodos () {
  const title = ref('')
  const todos = ref([
    {
      title: '学习Vue',
      done: false
    }
  ])
  const showModal = ref(false)

  function addTodo () {
    if (!title.value) {
      showModal.value = true
      setTimeout(() => {
        showModal.value = false
      }, 1500)
      return
    }
    todos.value.push({
      title: title.value,
      done: false
    })
    title.value = ''
  }

  /*  function removeTodo (e, i) {
    todos.value.splice(i, 1)
  } */

  function clear () {
    todos.value = todos.value.filter((v) => !v.done)
  }
  const active = computed(() => {
    return todos.value.filter((v) => !v.done).length
  })
  const all = computed(() => todos.value.length)
  const allDone = computed({
    get: function () {
      return active.value === 0
    },
    set: function (value) {
      todos.value.forEach((todo) => {
        todo.done = value
      })
    }
  })
  const animate = reactive({ show: false, el: null })
  function beforeEnter (el) {
    const dom = animate.el
    const rect = dom.getBoundingClientRect()
    const x = window.innerWidth - rect.left - 60
    const y = rect.top - 10
    el.style.transform = `translate(-${x}px, ${y}px)`
  }
  function enter (el, done) {
    // Expected an assignment or function call and instead saw an expression
    // document.body.offsetHeight
    el.style.transform = 'translate(0,0)'
    el.addEventListener('transitionend', done)
  }
  function afterEnter (el) {
    animate.show = false
    el.style.display = 'none'
  }
  function removeTodo (e, i) {
    animate.el = e.target
    animate.show = true
    todos.value.splice(i, 1)
  }
  return {
    title,
    todos,
    showModal,
    addTodo,
    removeTodo,
    clear,
    active,
    all,
    allDone,
    animate,
    beforeEnter,
    enter,
    afterEnter
  }
}
</script>

<style scoped>
h1 {
  color: red;
}
.info-wrapper {
  position: fixed;
  top: 20px;
  width: 200px;
}
.info {
  padding: 20px;
  color: white;
  background: #d88986;
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}
.modal-enter-active {
  transition: all 0.3s ease;
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.modal-leave-active {
  transition: all 0.3s ease;
}
.flip-list-move {
  transition: transform 0.8s ease;
}
.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 1s ease;
}
.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.remove-btn {
  cursor: pointer;
}
.animate-wrap .animate {
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 100;
  transition: all 0.5s linear;
}
.dustbin {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
