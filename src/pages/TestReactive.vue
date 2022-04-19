<!--
 * @Author: tywd
 * @Date: 2022-04-18 21:41:32
 * @LastEditors: tywd
 * @LastEditTime: 2022-04-18 21:41:33
 * @FilePath: /vue3-learn-project/src/pages/TestReactive.vue
 * @Description: reactive readonly isReactive isReadonly
-->
<template>
  <div>
    <h1>这是 TestReactive 页面</h1>
    <h1>
      <button @click="add">+</button>{{ num.currentNum }} num.currentNum
      reactive
    </h1>
    <h1>
      <button @click="add">+</button>{{ num2.currentNum }} num2.currentNum
      readonly
    </h1>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  readonly,
  isReactive,
  isReadonly,
  effect,
  shallowReactive,
  shallowReadonly,
} from 'vue'

let str = ref('ty')
let obj = reactive({
  count: 1,
})
const num = reactive({ currentNum: 0, nested: { foo: 1 }, array: [{ bar: 2 }] })
const num2 = readonly({ currentNum: 0 })
let double = computed(() => obj.count * 2)

/* // isReactive
console.log('testIsReactive', isReactive(num)) // false
console.log('isReactive(num.foo): ', isReactive(num.currentNum)) // false // 检查对象，检查值并什么用
console.log('isReactive(num.bar): ', isReactive(num.array)) // true  检查对象是否是由 reactive 创建的响应式代理。
console.log('isReactive(num.bar): ', isReactive(num.array[0])) // true

// isReadonly
const wrapped = readonly({ foo: 1, bar: { baz: 2 } })
console.log('isReadonly(wrapped.foo): ', isReadonly(wrapped.foo)) // false
console.log('isReadonly(wrapped.bar): ', isReadonly(wrapped.bar)) // true
console.log('testIsReadonly', isReadonly(num2)) // true */

// shallowReactive
const original = { foo: 1, nested: { bar: 2 } }
const observed = shallowReactive(original)
console.log('isReactive(observed): ', isReactive(observed));
console.log('isReactive(observed.nested: ', isReactive(observed.nested));

function add() {
  num.currentNum++
  num2.currentNum++
}
</script>
