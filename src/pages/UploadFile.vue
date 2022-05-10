<template>
  <h1>这是文件上传页</h1>
  <loading-outlined />
  <div
    ref='drag'
    id="drag"
  >
    <input
      type="file"
      name="file"
      @change="handleFileChange"
    >
  </div>

  <div>
    <a-progress
      :strokeWidth='20'
      :percent="uploadProgress"
    ></a-progress>
    <p>文件上传的进度</p>
  </div>
  <div>
    <a-button @click="uploadFile">上传大文件</a-button>
    <a-button @click="handleBtn">上传小文件</a-button>
  </div>
  <div>
    <a-progress
      :strokeWidth='20'
      :percent="state.hashProgress"
    ></a-progress>
    <p>计算hash的进度</p>
  </div>
  <!-- chunk.progress 
      progress<0 报错 显示红色
      == 100 成功
      别的数字 方块高度显示 -->
  <!-- 尽可能让方块看起来仕真方形
      比如10各方块 4*4
      9 3*3
      100 10*10 -->
  <!-- <pre>{{state.chunks}}</pre> -->
  <p>每一片的上传进度</p>
  <div
    class="cube-container"
    :style="{width:cubeWidth+'px'}"
  >
    <div
      class="cube"
      v-for="chunk in state.chunks"
      :key="chunk.name"
    >
      <div
        :class="{
              'uploading':chunk.progress>0&&chunk.progress<100,
              'success':chunk.progress==100,
              'error':chunk.progress<0
            }"
        :style="{height:chunk.progress+'%'}"
      >
        <loading-outlined v-if="chunk.progress<100 && chunk.progress>0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import sparkMD5 from 'spark-md5'
import {
  ref,
  reactive,
  computed,
  effect,
  toRefs,
  onMounted,
  getCurrentInstance,
  watchEffect,
} from 'vue'
import { postUploadFile, checkFile, postUploadBigFile, mergeFile } from 'api/'
import axios from 'axios'
axios.defaults.baseURL = `http://localhost:9111`
let worker = null
const SIZE = 1024 * 50 // 切片的大小1M
const state = reactive({
  file: null,
  hashProgress: 0,
  chunks: [],
})
const drag = ref(null)
const { proxy } = getCurrentInstance()

// 上传进度
let uploadProgress = computed(() => {
  const { chunks, file } = state
  if (!file || chunks.length === 0) return 0
  let loaded = chunks
    .map((item) => item.chunk.size * item.progress)
    .reduce((acc, cur) => acc + cur, 0)
  let progress = Number((loaded / file.size).toFixed(2))
  return progress
})

let cubeWidth = computed(() => {
  return Math.ceil(Math.sqrt(state.chunks.length)) * 20
})

effect(() => {
  console.log('effect: ', state.chunks)
})

watchEffect(() => {
  console.log('watchEffect: ', state.chunks)
})

// 监听input type file
const handleFileChange = (e) => {
  const [file] = e.target.files
  if (!file) return
  state.file = file
}

const getFormData = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', file.name)
  return formData
}

const bindEvents = () => {
  drag.value.addEventListener('dragover', (e) => {
    drag.value.style.borderColor = 'red'
    e.preventDefault()
  })
  drag.value.addEventListener('dragleave', (e) => {
    drag.value.style.borderColor = '#eee'
    e.preventDefault()
  })
  drag.value.addEventListener('drop', (e) => {
    const fileList = e.dataTransfer.files
    drag.value.style.borderColor = '#eee'
    state.file = fileList[0]
    console.log('state.file: ', state.file)
    e.preventDefault()
    // const e.dataTrans
  })
}

// 大文件上传
const uploadFile = async () => {
  let { file } = state
  if (!file) return
  /* if (!(await isImage(file))) {
    console.log('文件格式不对')
  } else {
    console.log('格式正确')
  } */
  const fileChunks = createFileChunks(file) // 1.创建切片-----------------------------------
  // 2.切片hash计算-----------------------------------
  let hash = null
  try {
    hash = await calculateHashSample()
    console.log('hash: ', hash)
    // const hash1 = await calculateHashIdle(fileChunks)
    // console.log('hash1: ', hash1)
    // const hash2 = await calculateHashWorker(fileChunks)
    // console.log('hash2: ', hash2)
    state.hash = hash
  } catch (error) {
    alert(error)
  }

  // hash计算后可以问一下后端，文件是否上传过，如果不存在，就看是否有存在的切片
  const {
    data: {
      data: { uploaded, uploadedList },
    },
  } = await checkfile(state.hash, file.name.split('.').pop())
  if (uploaded) {
    // 文件已存在 则秒传
    return proxy.$message.info('秒传成功')
  }

  state.chunks = fileChunks.map((chunk, index) => {
    const name = hash + '-' + index
    return {
      hash,
      name,
      index,
      chunk: chunk.file,
      // 设置进度条，已经上传的，设为100
      progress: uploadedList.indexOf(name) > -1 ? 100 : 0,
    }
  })
  // 2.切片hash计算-----------------------------------END

  // 3.切片上传 - 断点续传
  await uploadFileChunks(uploadedList)
  // 4.合并切片
  const {
    data: { code, msg },
  } = await mergeFileChunks()
  if (code === 0) {
    proxy.$message.info(msg)
  } else {
    proxy.$message.error('出错')
  }
}

// 检查是否存在文件 或 切片
const checkfile = async (hash, ext) => {
  return await axios({
    method: 'get',
    url: '/file/check',
    params: {
      hash,
      ext,
    },
  })
}

// 1.创建切片
const createFileChunks = (file, size = SIZE) => {
  console.log('file: ', file, typeof file)
  // file.__proto__.__proto__ --> Blob
  // Blob.prototype.slice
  const fileChunks = [] // 存放每一片的数组
  let cur = 0
  while (cur < file.size) {
    fileChunks.push({ index: cur, file: file.slice(cur, cur + size) }) // 切片后存入fileChunks数组
    cur += size
  }
  return fileChunks
}

// 2-1. 切片hash计算的第二种方式
// 用 web-worker 开辟多一个全新的进程
const calculateHashWorker = async (chunks) => {
  return new Promise((resolve, reject) => {
    if (!chunks || chunks.length <= 0) {
      reject(false)
      return
    }
    worker = new Worker(new URL('../static/hash.js', import.meta.url))
    worker.postMessage({ chunks: chunks }) //
    worker.onmessage = (e) => {
      const { progress, hash } = e.data
      state.hashProgress = Number(progress.toFixed(2))
      if (hash) {
        resolve(hash)
      }
    }
  })
}

// 2-2. 切片hash计算的第三种方式用 requestIdleCallback 利用浏览器的空闲时间
// 60fps
// 1秒渲染60次 渲染1次 1帧，大概16.6ms
// |帧(system task，render，script)空闲时间  |帧 painting idle   |帧   |帧   |
// 借鉴fiber架构
const calculateHashIdle = async (chunks) => {
  return new Promise((resolve) => {
    const spark = new sparkMD5.ArrayBuffer()
    let count = 0
    const appendToSpark = async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
          spark.append(e.target.result)
          resolve()
        }
      })
    }
    const workLoop = async (deadline) => {
      // timeRemaining获取当前帧的剩余时间
      while (
        count < chunks.length &&
        (deadline.timeRemaining() > 1 || deadline.didTimeout)
      ) {
        // 空闲时间，且有任务
        await appendToSpark(chunks[count].file)
        count++
        if (count < chunks.length) {
          state.hashProgress = Number(
            ((100 * count) / chunks.length).toFixed(2)
          )
        } else {
          state.hashProgress = 100
          resolve(spark.end())
        }
      }
      window.requestIdleCallback(workLoop)
    }
    // 浏览器一旦空闲，就会调用workLoop
    window.requestIdleCallback(workLoop)
  })
}

// 2-3. 切片hash计算 spark-md5 此处采用抽样hash 避免文件过大时计算hash时间过长
const calculateHashSample = async () => {
  // 布隆过滤器  判断一个数据存在与否 损失一部分精度来换取速度
  // 1个G的文件，抽样后5M以内
  // hash一样，文件不一定一样
  // hash不一样，文件一定不一样
  return new Promise((resolve) => {
    const spark = new sparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const file = state.file
    const size = file.size
    const offset = 2 * 1024 * 1024 // 每2M切一片
    // 第一个2M，最后一个区块数据全要
    let fileChunks = [file.slice(0, offset)]
    let cur = offset
    while (cur < size) {
      // 当前切片位置小于总长度
      if (cur + offset >= size) {
        // 最后一个区块
        fileChunks.push(file.slice(cur, cur + offset))
      } else {
        // 中间的区块
        // 中间的，每取2M区块内的前中后各2个字节
        const mid = cur + offset / 2
        const end = cur + offset
        fileChunks.push(file.slice(cur, cur + 2))
        fileChunks.push(file.slice(mid, mid + 2))
        fileChunks.push(file.slice(end - 2, end))
      }
      cur += offset
    }
    reader.readAsArrayBuffer(new Blob(fileChunks))
    reader.onload = (e) => {
      spark.append(e.target.result)
      state.hashProgress = 100
      resolve(spark.end())
    }
  })
}

// 3.上传切片 - 断点续传
const uploadFileChunks = async (uploadedList = []) => {
  // 每个切片都为FormData
  const requests = state.chunks
    .filter((chunk) => uploadedList.indexOf(chunk.name) === -1) // 过滤已上传的切片，剩下未上传的继续上传，即断点续传
    .map((chunk, index) => {
      const formData = new FormData()
      formData.append('hash', chunk.hash)
      formData.append('chunk', chunk.chunk)
      formData.append('name', chunk.name)
      return { formData, index: chunk.index, error: 0 }
    })
  /* .map(async ({ formData, index }) => {
      // 此处的 index 取得是上面map return出来的chunk.index，由于我们进行了filter，所以不能再使用上一个map一开始的index
      return await uploadBigRequest(formData, index)
    }) */
  // await Promise.all(requests)

  // TODO 并发量控制
  // 尝试申请tcp链接过多，也会造成卡顿
  // 异步的并发数控制，
  await resquestControl(requests)
}

/* // TODO
还能优化的点 TCP慢启动，先上传一个初始区块，比如10KB，根据上传成功时间，决定下一个区块是20K，还是50K，还是5K
在下一个一样的逻辑，可能变成100K，200K，或者2K */
/**
 * 请求并发控制
 * 上传可能报错，报错之后，进度条变红，开始重试，一个切片重试失败三次，整体全部终止
 */
const resquestControl = async (chunks, limit = 3) => {
  // limit 并发数
  // [task1,task2,task3] 完成一个task1 则去掉task1 ，加入task4 => [task2,task3,task4]
  return new Promise((resolve, reject) => {
    const len = chunks.length
    let count = 0
    let isStop = false

    const start = async () => {
      if (isStop) {
        return
      }
      const task = chunks.shift()
      if (task) {
        const { formData, index } = task
        try {
          await uploadBigRequest(formData, index)
          if (count === len - 1) {
            // 最后一个任务
            resolve()
          } else {
            count++
            start() // 启动下一个任务
          }
        } catch (error) {
          state.chunks[index].progress = -1
          if (task.error < 3) {
            task.error++
            chunks.unshift(task) // 报错则将该任务再此加回头部继续重试请求
            start()
          } else {
            // 错误三次 直接在调用start时停止
            isStop = true
            reject()
          }
        }
      }
    }

    while (limit > 0) {
      // 并发启动limit个任务
      // 模拟一下延迟
      setTimeout(() => {
        start()
      }, Math.random() * 2000)
      limit -= 1
    }
  })
}

// 4.合并切片
const mergeFileChunks = async () => {
  const { file, hash } = state
  return await axios({
    method: 'get',
    url: '/file/merge',
    params: {
      ext: file.name.split('.').pop(),
      size: SIZE,
      hash: hash,
    },
  })
}

// 将我们需要的文件的16进制的某段读出来
const blobToString = async (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function() {
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
const isGif = async (file) => {
  // GIF89a 和GIF87a
  // 前面6个16进制，'47 49 46 38 39 61' or '47 49 46 38 37 61'
  // 16进制的转换
  const ret = await blobToString(file.slice(0, 6))
  const isGif = ret == '47 49 46 38 39 61' || ret == '47 49 46 38 37 61'
  return isGif
}
const isPng = async (file) => {
  const ret = await blobToString(file.slice(0, 8))
  console.log('ret: ', ret)
  const ispng = ret == '89 50 4E 47 0D 0A 1A 0A'
  return ispng
}
const isJpg = async (file) => {
  const len = file.size
  const start = await blobToString(file.slice(0, 2))
  const tail = await blobToString(file.slice(-2, len))
  const isjpg = start == 'FF D8' && tail == 'FF D9'
  return isjpg
}
const isImage = async (file) => {
  // 通过文件流来判定
  // 先判定是不是gif
  return (await isGif(file)) || (await isPng(file)) || (await isJpg(file))
}

// 大文件上传请求
const uploadBigRequest = async (formData, i) => {
  return axios({
    method: 'post',
    url: '/file/bigUpload',
    data: formData,
    onUploadProgress: (progress) => {
      // 不是整体的进度条了，而是每个区块有自己的进度条，整体的进度条需要计算
      state.chunks[i].progress = Number(
        ((progress.loaded / progress.total) * 100).toFixed(2)
      )
    },
  })
}
// 普通文件上传测试
const handleBtn = () => {
  const { file } = state
  if (!file) return
  const formData = getFormData(file)
  /* postUploadFile({
    formData,
  })
    .then(function(response) {
      console.log('handleBtn: ', response)
    })
    .catch(function(error) {
      console.log('error: ', error)
    }) */
  axios({
    method: 'post',
    url: '/file/upload',
    data: formData,
  })
    .then(function(response) {
      console.log('handleFileUpload: ', response)
    })
    .catch(function(error) {
      console.log('error: ', error)
    })
}

onMounted(() => {
  bindEvents()
})
</script>

<style lang="scss" scoped>
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
}

.cube-container {
  .cube {
    width: 18px;
    height: 18px;
    line-height: 12px;
    border: 1px black solid;
    background: #eee;
    float: left;
  }
  .success {
    background: green;
  }
  .uploading {
    background: #000;
  }
  .error {
    background: red;
  }
}
</style>
