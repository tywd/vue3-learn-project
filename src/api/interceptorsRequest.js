import axios from 'axios'
import Request from './request'
import qs from 'qs'
import {
  message
} from 'ant-design-vue'
const LOCALURL911 = 'http://localhost:9111/'
const LOCALURL = '/api' // 代理转发api，需要配合 vite.config.js 的 server 使用
/**
 * @Descripttion: 函数通过请求的信息返回唯一的请求key
 * @param {object} config { method, url, params, data } 
 * @return {*} key
 */
function getRequestKey(config) {
  let {
    method,
    url,
    params,
    data
  } = config;
  return [method, url, qs.stringify(params), qs.stringify(data)].join("&");
}

let pendingRequestMap = new Map(); // 将pending状态的请求，以key 和 cancel 函数键值对的形式保存到 Map 对象中， Map 的好处是可以快速的判断是否有重复的请求
/**
 * @Descripttion: 添加请求信息
 * @param {object} config { method, url, params, data } 
 */
function addPendingRequest(config) {
  let requestKey = getRequestKey(config);
  // 两种取消请求的方法
  // 1. CancelToken.source 工厂方法创建 cancel token
  // 2. 通过传递一个 executor(cancel) 函数到 axios.CancelToken 的构造函数中
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingRequestMap.has(requestKey)) { // 未存在重复请求，将当前请求存入
      pendingRequestMap.set(requestKey, cancel);
    }
  });
}

/**
 * @Descripttion: 取消重复请求，移除重复请求信息
 * @param {string} key config拼接好的key getRequestKey(config)
 */
function removePendingRequest(key) {
  let requestKey = key;
  if (pendingRequestMap.has(requestKey)) { // 如果是重复的请求，则执行对应的cancel函数
    let cancel = pendingRequestMap.get(requestKey);
    cancel(requestKey);
    pendingRequestMap.delete(requestKey); // 将前一次重复的请求移除
  }
}

const instance = axios.create({
  baseURL: LOCALURL,
  timeout: 10000,
  // headers: {
  //   'X-Custom-Header': 'foobar'
  // },
  // responseType: 'json' // 默认的 // 表示服务器响应的数据类型
});
// httpService.defaults.headers.common['Authorization'] = 'Bearer' + localStorage.getItem('token')
// post请求提交的是json格式的数据，则content-type如下
// instance.defaults.headers.post['content-type'] = 'application/json; charset=utf-8'

/**
 * 设置拦截器 request请求拦截
 */
instance.interceptors.request.use(config => {
  if (!config.onUploadProgress) { // 大文件上传不做限制，大文件切片上传的FormData可能导致 getRequestKey 是相同的而被取消了请求
    removePendingRequest(getRequestKey(config)); // 检查是否存在重复请求，若存在则取消已发的请求
    addPendingRequest(config); // 把当前请求信息添加到 pendingRequestMap 对象中
  }

  // eslint-disable-next-line no-constant-condition
  if (localStorage.getItem('token')) { // 需自定义 // 判断是否存在token，如果存在的话，则每个http header都加上token
    // 让每个请求携带token
    config.headers.Authorization = 'Bearer' + localStorage.getItem('token')
  }
  return config
}, error => {
  // 请求错误处理
  return Promise.reject(error)
})

/**
 * 设置拦截器 response响应拦截
 */
instance.interceptors.response.use(response => {
  // 若已经响应请求也从 pendingRequestMap 对象中移除请求
  if (!response.config.onUploadProgress) { // 大文件上传不做限制，大文件切片上传的FormData可能导致 getRequestKey 是相同的而被取消了请求
    removePendingRequest(getRequestKey(response.config));
  }
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (response.status === 200) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response);
  }
}, error => {
  if (!error) return;
  if (axios.isCancel(error)) { // 确认是否改请求是被取消的
    console.log("已取消的重复请求：" + error.message, error);
    removePendingRequest(getRequestKey(error.message));
  } else {
    // 对响应错误时
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break
        case 401:
          error.message = '未授权，请重新登录'
          // 清除token信息并跳转到登录页面
          localStorage.removeItem('Authorization')
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000);
          break
        case 403:
          // 403 token过期
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误，未找到该资源！'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `未知错误${error.response.status}`
      }
    } else {
      error.message = '连接到服务器失败'
    }
    message.error(JSON.stringify(error) || '请求出错')
  }
  return Promise.reject(error)
})

export default new Request(instance)