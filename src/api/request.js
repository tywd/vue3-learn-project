import axios from 'axios'
const LOCALURL911 = 'http://localhost:9111/'
const LOCALURL = '/api'
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
instance.defaults.headers.post['content-type'] = 'application/json charset=utf-8'

/**
 * 设置拦截器 request请求拦截
 */
instance.interceptors.request.use(config => {
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
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (response.status === 200) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response);
  }
}, error => {
  // 对响应错误时
  if (error && error.response) {
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
  return Promise.reject(error)
})

class Request {
  constructor() {

  }
  request(params) {
    console.log('params: ', params);
    const {
      url,
      type,
      data
    } = params;
    const subData = type === 'post' ? {
      data
    } : {
      params: data
    }
    return new Promise((resolve, reject) => {
      instance({
        url,
        method: type,
        ...subData,
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  uploadRequest(params) {
    const {
      url,
      type,
      data
    } = params;
    axios.defaults.baseURL = LOCALURL911
    axios({
        url,
        method: type,
        data,
      })
      .then(function (response) {
        console.log('handleFileUpload: ', response)
      })
      .catch(function (error) {
        console.log('error: ', error)
      })
  }
}

export default new Request()

// /* *
//  *  get请求
//  *  url:请求地址
//  *  params:参数
//  */
// const get = (url, params = {}) => {
//   return new Promise((resolve, reject) => {
//     instance({
//       url: url,
//       method: 'get',
//       params: params
//     }).then(response => {
//       resolve(response)
//     }).catch(error => {
//       reject(error)
//     })
//   })
// }

// /* *
//  *  post请求
//  *  url:请求地址
//  *  params:参数
//  */
// const post = (url, params = {}) => {
//   return new Promise((resolve, reject) => {
//     instance({
//       url: url,
//       method: 'post',
//       data: params
//     }).then(response => {
//       resolve(response)
//     }).catch(error => {
//       reject(error)
//     })
//   })
// }

// /**
//  *  文件上传
//  *  url:请求地址
//  *  params:参数
//  */
// const fileUpload = (url, params = {}) => {
//   return new Promise((resolve, reject) => {
//     instance({
//       url: url,
//       method: 'post',
//       data: params,
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }).then(response => {
//       resolve(response)
//     }).catch(error => {
//       reject(error)
//     })
//   })
// }
// export default {
//   get,
//   post,
//   fileUpload
// }