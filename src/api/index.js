import request from './interceptorsRequest'

// 文件上传
const postUploadFile = function (params) {
  return request.request({
    type: 'post',
    url: '/file/upload',
    data: params.formData
  })
}

// 校验文件是否存在或者上传了多少切片
const checkFile = function (data) {
  return request.request({
    type: 'get',
    url: '/file/check',
    data
  })
}

// 大文件切片上传
const postUploadBigFile = function ({ data, onUploadProgress }) {
  return request.request({
    type: 'post',
    url: '/file/bigUpload',
    data,
    onUploadProgress
  })
}

// 合并切片文件
const mergeFile = function (data) {
  return request.request({
    type: 'get',
    url: '/file/merge',
    data
  })
}

// 查询商品列表
const goodsQuery = function (data) {
  return request.request({
    type: 'get',
    url: '/goods/queryAll',
    data
  })
}

export {
  postUploadFile,
  checkFile,
  postUploadBigFile,
  mergeFile,
  goodsQuery
}
