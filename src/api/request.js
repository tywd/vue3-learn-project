export default class Request {
  constructor (instance) {
    this._instance = instance
  }

  request (params) {
    const {
      url,
      type,
      data,
      onUploadProgress
    } = params
    const subData = type === 'post'
      ? (onUploadProgress
        ? {
          data,
          onUploadProgress
        }
        : {
          data
        })
      : {
        params: data
      }
    return new Promise((resolve, reject) => {
      this._instance({
        url,
        method: type,
        ...subData
      }).then(response => {
        const {
          code,
          data,
          msg
        } = response
        if (code === 0) {
          resolve(data)
        } else {
          reject(msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
