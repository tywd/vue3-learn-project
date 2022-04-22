<!--
 * @Author: scy
 * @Date: 2022-04-13 11:12:04
 * @LastEditors: scy
 * @LastEditTime: 2022-04-13 14:06:24
 * @FilePath: /vue3-learn-project/src/pages/Test.vue
 * @Description: Do not edit
-->
<template>
  <a-tabs class="my-eltab" v-model:activeKey="activeKey" type="card">
    <a-tab-pane key="1" tab="Tab 1">
      Content of Tab Pane 1
      <Chart />
    </a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2" force-render>
      Content of Tab Pane 2

      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember"
            >Remember me</a-checkbox
          >
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="showModal">Open Modal</a-button>
      <a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
        <p>{{ value }}</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-modal>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">
      Content of Tab Pane 3
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
        </template>
      </a-table>
      <a-pagination
        v-model:current="current"
        show-quick-jumper
        :total="500"
        @change="onChange"
      />
      <a-button type="primary" @click="info">Display normal message</a-button>
    </a-tab-pane>
  </a-tabs>
</template>
<script setup>
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import Chart from '../components/Chart.vue'

const { proxy, ctx } = getCurrentInstance()
const internalInstance = getCurrentInstance()
console.log('internalInstance: ', internalInstance);

// tab1

// tab2
const formState = reactive({
  username: '',
  password: '',
  remember: true,
})
const { username, password, remember } = formState
const onFinish = (values) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

const visible = ref(false)
const showModal = () => {
  visible.value = true
}

const handleOk = (e) => {
  console.log(e)
  visible.value = false
}

// tab3
const state = reactive({
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ],
  data: [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  rowSelection: {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  },
  pagination: {},
})
let current = ref(6)
const onChange = (pageNumber) => {
  console.log('Page: ', pageNumber)
}
const { data, columns, rowSelection, pagination } = state

let activeKey = ref('1')
const info = () => {
  proxy.$message.info('This is a normal message')
  proxy.$notification.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!')
    },
  })
}
</script>

<style scoped>
.my-eltab {
  text-align: left;
}
</style>
