import { request } from '@tarojs/taro'

export const renderContext = ({ path, animationData }, callback) => {
  if (path) {
    request({
      method: 'GET',
      url: path,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      timeout: 100000
    })
      .then(res => {
        if (res.statusCode === 200 && res.data) {
          setTimeout(() => {
            // callback(animationData)
            callback(res.data)
          }, 500)
        }
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    setTimeout(() => {
      callback(animationData)
    }, 200)
  }
}
