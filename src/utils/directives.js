// 自定义指令
// https://v3.cn.vuejs.org/api/application-api.html#directive
// https://v3.cn.vuejs.org/guide/migration/custom-directives.html
/* Vue2.x 
bind - 指令绑定到元素后调用。只调用一次。
inserted - 元素插入父 DOM 后调用。
update - 当元素更新，但子元素尚未更新时，将调用此钩子。
componentUpdated - 一旦组件和子级被更新，就会调用这个钩子。
unbind - 一旦指令被移除，就会调用这个钩子。也只调用一次。 */

/* Vue3.x
created - 新增！在元素的 attribute 或事件监听器被应用之前调用。
bind → beforeMount
inserted → mounted
beforeUpdate：新增！在元素本身被更新之前调用，与组件的生命周期钩子十分相似。
update → 移除！该钩子与 updated 有太多相似之处，因此它是多余的。请改用 updated。
componentUpdated → updated
beforeUnmount：新增！与组件的生命周期钩子类似，它将在元素被卸载之前调用。
unbind -> unmounted
 */
import {
    message,
} from 'ant-design-vue'
import { Vue2 } from 'vue-global-api/node_modules/vue-demi';
const demo = {
    // Vue3.x 的生命周期
    // 指令具有一组生命周期钩子：
    // 在绑定元素的 attribute 或事件监听器被应用之前调用
    created() {},
    // 在绑定元素的父组件挂载之前调用
    beforeMount() {},
    // 在绑定元素的父组件挂载之后调用
    mounted(el, binding) {},
    // 在包含组件的 VNode 更新之前调用
    beforeUpdate() {},
    // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
    updated() {},
    // 在绑定元素的父组件卸载之前调用
    beforeUnmount() {},
    // 在绑定元素的父组件卸载之后调用
    unmounted() {},
}

// 自动聚焦 input
const vFocus = {
    // 当被绑定的元素挂载到 DOM 中时……
    mounted(el) {
        console.log('focus-el: ', el);
        el.focus() // 聚焦元素
    }
}
// 点击防抖
const vDebounceClick = {
    /*
        mounted 钩子函数，第一次绑定时调用，可以在这里做初始化设置
        el: 作用的 dom 对象
    */
    // 当被绑定的元素挂载到 DOM 中时……
    mounted(el, binding) {
        let debounceTime = binding.value; // 防抖时间
        if (!debounceTime) { // 若不设置防抖时间，则默认2s
            debounceTime = 2000;
        }
        let cbFun;
        el.handle = event => {
            if (!cbFun) { // 第一次执行
                cbFun = setTimeout(() => {
                    cbFun = null;
                }, debounceTime);
            } else {
                event && event.stopImmediatePropagation(); // 阻止事件冒泡并且阻止该元素上同事件类型的监听器被触发
            }
        }
        el.addEventListener('click', el.handle, true);
    },
    // 指令与元素解绑的时候，移除事件绑定
    unmounted(el) {
        el.removeEventListener('click', el.handle);
    }
}

/**
 * name 长按事件
 * @type {*} 
 * description: binding.value 必须是一个 function，在function 里面 return一个 (e)=>{} 可给该方法传参
 *  使用  引入directive后，
    <div  v-longpress="testLongPress(1)" ></div>
    const testLongPress = (e) => {
        return () => {
            console.log('testLongPress: ', e, 1)
        }
    } 
 * 如果 binding.value {fn:func,v:1} 也可在 binding.value.fn(binding.value.v) 将参数传回去给方法
 */
const vLongpress = {
    mounted: function (el, binding) {
        console.log('binding: ', binding , typeof binding.value);
        if (!binding.value) return message.error('长按指令v-longpress未传入binding.value')
        if (typeof binding.value !== 'function') {
            console.warn(`[longpress:] provided expression '${binding.value}' is not a function, but has to be `);
        }

        let pressTimer = null;
        const start = (e) => {
            if (e.type === 'click' && e.button !== 0) {
                return;
            }
            if (pressTimer === null) {
                pressTimer = setTimeout(() => {
                    handler();
                }, 1000)
            }
        }

        const cancel = (e) => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        }

        const handler = (e) => {
            binding.value()
        }

        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);

        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
    }
}

export default {
    focus: vFocus,
    debounce: vDebounceClick,
    longpress: vLongpress
}