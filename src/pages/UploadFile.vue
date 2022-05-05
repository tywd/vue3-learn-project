<template>
  <h1>这是文件上传页</h1>
  <h1>用户中心</h1>
  <!-- <loading-outlined /> -->
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
  </div>
  <div>
    <a-button @click="uploadFile">上传大文件</a-button>
    <a-button @click="handleBtn">上传小文件</a-button>
  </div>
  <div>
    <p>计算hash的进度</p>
    <a-progress
      :strokeWidth='20'
      :percentage="hashProgress"
    ></a-progress>
  </div>
  <!-- chunk.progress 
      progress<0 报错 显示红色
      == 100 成功
      别的数字 方块高度显示 -->
  <!-- 尽可能让方块看起来仕真方形
      比如10各方块 4*4
      9 3*3
      100 10*10 -->
  <!-- <div
    class="cube-container"
    :style="{width:cubeWidth+'px'}"
  >
    <div
      class="cube"
      v-for="chunk in chunks"
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
  </div> -->
</template>

<script setup>
import { ref, reactive, computed, effect, toRefs, onMounted } from 'vue'
import { postUploadFile, checkFile, postUploadBigFile, mergeFile } from 'api/'
import axios from 'axios'
const state = reactive({
  file: null,
  // uploadProgress:0,
  hashProgress: 0,
  chunks: [],
})
let uploadProgress = computed(() => {
  /* if (!this.file || this.chunks.length) {
    return 0
  }
  const loaded = this.chunks
    .map((item) => item.chunk.size * item.progress)
    .reduce((acc, cur) => acc + cur, 0)
  return parseInt(((loaded * 100) / this.file.size).toFixed(2)) */
  return 50
})

const uploadFile = () => {
  if (!state.file) return
}

const handleFileChange = (e) => {
  const [file] = e.target.files
  if (!file) return
  state.file = file
}

const getFormData = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', file.name)
  // formData.append('filename', filename);
  // formData.append('hash', index);
  // formData.append('chunk', chunk);
  return formData
}

const handleBtn = () => {
  const { file } = state
  if (!file) return
  const formData = getFormData(file)
  postUploadFile({
    data: formData,
  })
    .then(function(response) {
      console.log('handleBtn: ', response)
    })
    .catch(function(error) {
      console.log('error: ', error)
    })
}

let { file, hashProgress, chunks } = state
</script>

<style lang="scss" scoped>
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
  .cube-container {
    .cube {
      width: 14px;
      height: 14px;
      line-height: 12px;
      border: 1px black solid;
      background: #eee;
      float: left;
    }
    > .success {
      background: green;
    }
    > .uploading {
      background: blue;
    }
    > .error {
      background: red;
    }
  }
}
</style>
