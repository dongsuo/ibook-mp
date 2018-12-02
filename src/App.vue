<script>
// import store from '@/store'
const AV = require('leancloud-storage/dist/av-weapp-min.js')

export default {
  data () {
    return {
      userInfo: {},
      logged: false
    }
  },
  created () {
    AV.init(process.env.LEAN_ID, process.env.LEAN_KEY)
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
    if (this.logged) return
  }
}
</script>

<style>
@import 'styles/font/iconfont.css';

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 10px;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

[class^="weui-icon-"],
[class*=" weui-icon-"] {
  display: inline-block;
  vertical-align: middle;
  font: normal normal normal 14px/1 "weui";
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
</style>
