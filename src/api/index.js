import request from './request';

// 文件上传
const postUploadFile = function (params) {
  return request.request({
      type: 'post',
      url: '/file/upload',
      data: params.formData,
      isUpload: true,
    });
}

// 校验文件是否存在或者上传了多少
const checkFile = function () {
  return request.request({
      type: 'post',
      url: '/file/checkfile',
    });
}

// 大文件切片上传
const postUploadBigFile = function (params, xhr) {
  return request.uploadRequest({
      type: 'post',
      url: '/file/bigUpload',
      data: params,
      isUpload: true,
      // xhr: xhr.onUploadProgress
    });
}

// 合并切片文件
const mergeFile = function () {
  return request.request({
      type: 'post',
      url: '/file/mergefile',
    });
}

// 查询商品列表
const goodsQuery = function (data) {
  return request.request({
      type: 'get',
      url: '/goods/queryAll',
      data
    });
}

export {
  postUploadFile,
  checkFile,
  postUploadBigFile,
  mergeFile,
  goodsQuery
}