import {
    ref,
    watch,
    onMounted,
    onUnmounted
} from 'vue'
// 修改图标
export function useFavicon(newIcon) {
    const favicon = ref(newIcon)

    const updateIcon = (icon) => {
        document.head
            .querySelectorAll(`link[rel*="icon"]`)
            .forEach(el => el.href = `${icon}`)
    }
    const reset = () => favicon.value = '/favicon.ico'

    watch(favicon,
        (i) => {
            updateIcon(i)
        }
    )
    return {
        favicon,
        reset
    }
}
export function useMouse() {
    const x = ref(0);
    const y = ref(0)

    function update(e) {
        x.value = e.pageX
        y.value = e.pageY
    }
    onMounted(() => {
        window.addEventListener('mousemove', update)
    })
    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    })
    return {
        x,
        y
    }
}