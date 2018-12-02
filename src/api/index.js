// const qcloud = require('../../node_modules/wafer2-client-sdk/index.js')
import store from '@/store'

const api = process.env.BASE_URL

// qcloud.setLoginUrl(`${api}/weapp/login`)
const qfetch = function (option) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api + option.url,
      method: option.method || 'GET',
      data: option.data || undefined,
      header: {
        'X-L-TOKEN': store.state.loginInfo.userInfo.objectId || ''
      },
      success: function (res) {
        resolve(res.data)
      },
      fail: function (err) {
        console.log(err)
        resolve(err)
      }
    })
  })
}
export default qfetch
