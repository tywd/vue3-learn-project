import {
  ref,
  watch,
  onMounted,
  onUnmounted
} from 'vue'

// 修改图标
function useFavicon(newIcon) {
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

function useMouse() {
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

// 将我们需要的文件的16进制编码读出来
const blobToString = async (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      const ret = reader.result
        .split('')
        .map((v) => v.charCodeAt()) // 转为ASCII码
        .map((v) => v.toString(16).toUpperCase()) // 转为 16进制
        // .map(v=>v.padStart(2,'0'))
        .join(' ')
      resolve(ret)
      // const ret = reader.
    }
    reader.readAsBinaryString(blob) // readAsBinaryString 方法会读取指定的 Blob 或 File 对象，当读取完成的时候，readyState  会变成DONE（已完成），并触发 loadend (en-US) 事件，同时 result 属性将包含所读取文件原始二进制格式。
  })
}

// 是否gif
const isGif = async (file) => {
  // GIF89a 和GIF87a
  // 前面6个16进制，'47 49 46 38 39 61' or '47 49 46 38 37 61'
  // 16进制的转换
  const ret = await blobToString(file.slice(0, 6))
  const isGif = ret == '47 49 46 38 39 61' || ret == '47 49 46 38 37 61'
  return isGif
}

// 是否png
const isPng = async (file) => {
  const ret = await blobToString(file.slice(0, 8))
  const ispng = ret == '89 50 4E 47 0D 0A 1A 0A'
  return ispng
}

// 是否jpg
const isJpg = async (file) => {
  const len = file.size
  const start = await blobToString(file.slice(0, 2))
  const tail = await blobToString(file.slice(-2, len))
  const isjpg = start == 'FF D8' && tail == 'FF D9'
  return isjpg
}

// 通过文件流来判定是否是图片
const isImage = async (file) => {
  return (await isGif(file)) || (await isPng(file)) || (await isJpg(file))
}

// 防抖
const debounce = (fn, delay = 300) => {
  let timer = 0;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  }
}

// 节流
const throttle = (fn, delay=300) => {
  let last = 0;
  return (...args) => {
    if (Date.now() - last > delay) {
      last = Date.now()
      setTimeout(() => {
        fn.call(this, ...args);
      }, delay);
    }
  }
}


export {
  useFavicon,
  useMouse,
  blobToString,
  isGif,
  isPng,
  isJpg,
  isImage,
  debounce,
  throttle
}