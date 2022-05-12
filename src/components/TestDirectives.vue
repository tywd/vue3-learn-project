<!-- 自定义指令测试 -->
<template>
  <h2>自定义指令测试</h2>
  <div id="dynamicexample">
    <h2>Scroll down the page</h2>
    <input
      type="text"
      v-focus
      placeholder="ty"
    >
    <div v-demo="{ color: 'white', text: 'hello!' }"></div>
    <br>
    <button
      v-debounce="1000"
      @click="testDebounce"
    >防抖</button>
    <br>
    <br>
    <img
      v-longpress="testLongPress(1)"
      width="200"
      src="../assets/gouku.jpg"
      alt=""
    >
    <br>
    <br>
    <div class="test-range">
      <input
        type="range"
        min="0"
        max="500"
        v-model="pinPadding"
      >
      <p v-pin:[direction]="pinPadding">Stick me {{ pinPadding + 'px' }} from the {{ direction || 'top' }} of the page</p>
    </div>

  </div>
</template>

<script >
// https://v3.cn.vuejs.org/api/application-api.html#directive
// https://v3.cn.vuejs.org/guide/migration/custom-directives.html
import { ref, onMounted, toRefs, reactive } from 'vue'
import { debounce } from 'utils'
export default {
  directives: {
    pin: {
      mounted(el, binding) {
        el.style.position = 'fixed'
        const s = binding.arg || 'top'
        el.style[s] = binding.value + 'px'
      },
      // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
      updated(el, binding) {
        const s = binding.arg || 'top'
        el.style[s] = binding.value + 'px'
      },
    },
    demo: {
      // Vue3.x 的生命周期
      // 指令具有一组生命周期钩子：
      // 在绑定元素的 attribute 或事件监听器被应用之前调用
      created() {},
      // 在绑定元素的父组件挂载之前调用
      beforeMount() {},
      // 在绑定元素的父组件挂载之后调用
      mounted(el, binding) {
        // 对象字面量传值
        console.log('v-demo mounted binding: ', binding.value.color) // => "white"
        console.log('v-demo mounted binding: ', binding.value.text) // => "hello!"
      },
      // 在包含组件的 VNode 更新之前调用
      beforeUpdate() {},
      // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
      updated() {},
      // 在绑定元素的父组件卸载之前调用
      beforeUnmount() {},
      // 在绑定元素的父组件卸载之后调用
      unmounted() {},
    },
    /* // Vue2.x 的生命周期
    bind - 指令绑定到元素后调用。只调用一次。
    inserted - 元素插入父 DOM 后调用。
    update - 当元素更新，但子元素尚未更新时，将调用此钩子。
    componentUpdated - 一旦组件和子级被更新，就会调用这个钩子。
    unbind - 一旦指令被移除，就会调用这个钩子。也只调用一次。 */
  },
  setup(props, { emit }) {
    const state = reactive({
      direction: 'right',
      pinPadding: 200,
    })
    const testDebounce = (e) => {
      console.log('v-debounce: ', e)
    }

    //
    const testLongPress = (e) => {
      return () => {
        console.log('testLongPress: ', e, 1)
      }
    }
    return {
      testDebounce,
      testLongPress,
      ...toRefs(state),
    }
  },
}

/* */

onMounted(() => {})
</script>

<style scoped>
.test-range {
  width: 100%;
  height: 300px;
}
</style>