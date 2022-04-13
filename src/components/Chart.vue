<template>
  <div class="chart-wrap">
    <!-- <div
      :id="id"
      :class="className"
      :style="{ height: height, width: width }"
    /> -->
    <div
      id="my-chart"
      :class="className"
      :style="{ height: height, width: width }"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { getCurrentInstance, onMounted, reactive, onBeforeUnmount } from 'vue'
let { proxy } = getCurrentInstance()
defineProps({
  className: {
    type: String,
    default: 'chart',
  },
  id: {
    type: String,
    default: 'chart',
  },
  width: {
    type: String,
    default: '1000px',
  },
  height: {
    type: String,
    default: '500px',
  },
})
const state = reactive({
  chart: null,
})

let data = []
let now = new Date(1997, 9, 3)
let oneDay = 24 * 3600 * 1000
let value = Math.random() * 1000
const randomData = () => {
  now = new Date(+now + oneDay)
  value = value + Math.random() * 21 - 10
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
      Math.round(value),
    ],
  }
}

const initChart = () => {
  state.chart = echarts.init(document.getElementById('my-chart'), 'dark')
  const options = reactive({
    title: {
      text: 'Dynamic Data & Time Axis',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0]
        var date = new Date(params.name)
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          ' : ' +
          params.value[1]
        )
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        showSymbol: false,
        data: data,
      },
    ],
  })
  state.chart.setOption(options)
}

onMounted(() => {
  for (var i = 0; i < 1000; i++) {
    data.push(randomData())
  }
  setInterval(() => {
    for (var i = 0; i < 5; i++) {
      data.shift()
      data.push(randomData())
    }
    state.chart.setOption({
      series: [
        {
          data: data,
        },
      ],
    })
  }, 1000)
  initChart()
})

/* onBeforeUnmount(() => {
  if (!state.chart) {
    return
  }
  state.chart.dispose()
  state.chart = null
}) */
</script>

<style scoped>
.chart-wrap {
  width: auto;
  overflow-x: auto;
  height: inherit;
  background: var(--linear-gradient-bg);
  border-radius: 12px;
}
</style>
