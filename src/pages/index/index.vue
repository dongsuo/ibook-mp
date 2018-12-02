<template>
  <div class="container">
    <div class="scan-wraper">
      <i class="iconfont icon-ccgl-yundanpicisaomiao-4-copy" @click="handleScan($event)"></i>
      <input placeholder="搜索图书/左侧扫描条形码" v-model="keyword" confirm-type="search" @confirm="handleSearch"/>
      <i class="iconfont icon-search" @click="handleSearch"></i>
    </div>
    <div class="userinfo" v-if="loginStatus">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>
    <div v-else>
      <button open-type="getUserInfo" @getuserinfo="getUserAuth" size="mini" class="login-btn" type="primary">登录</button>
    </div>
    <div v-if="usercollection.length===0">
      <div class="tips">你的阅读记录空空如也~</div>
      <div class="tips">快去添加吧！</div>
    </div>
    <div v-else class="collect-list">
      <div v-for="(item,index) in usercollection" :key="index" @click="goBookPage(item.isbn)" class="collect-list-item">
        <!-- <img :src="item.image" mode='aspectFit'/> -->
        <!-- <div class="book-info-item">
          <h1 class="book-title">{{item.title}}</h1>
          <p>标记时间：{{item.updatedAt}}</p>
          <span class="collect-status">{{item.statusText}}</span>
        </div> -->
        <!-- <img :src="item.image" style="width:60px;" mode="aspectFit"/> -->
        <span class="collect-status">{{item.statusText}}</span>
        <span>{{item.book_name}}</span>
        <!-- <span class="collect-time">{{item.updatedAt}}</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { usercollection } from '@/api/usercollection'
const AV = require('leancloud-storage/dist/av-weapp-min.js')

// [^\x00-\xff] 匹配双字节字符
function get14Length (str) {
  let reg = RegExp(/[^\x00-\xff]/gi)
  let cArr
  let splitMark = 28
  let length = str.length
  let count = 0 // 双字节字符数量
  while ((cArr = reg.exec(str)) !== null) {
    count++
    splitMark--
    length++
    // console.log(cArr.index + 1, count)
    if (cArr.index + count + 1 >= 28) {
      str = str.substr(0, cArr.index + 1) + ' …'
      return str
    }
  }
  if (length >= 28) {
    str = str.substr(0, splitMark) + ' …'
  }
  return str
}

export default {
  data () {
    return {
      keyword: '',
      userInfo: {
        nickName: '',
        avatarUrl: ''
      },
      user: undefined,
      loginStatus: false,
      usercollection: []
    }
  },
  onReady () {
    this.login()
  },
  onShow () {
    if (this.userInfo.objectId) {
      this.getUserCollections()
    }
  },
  created () {
    wx.updateShareMenu({
      withShareTicket: true
    })
  },
  methods: {
    goBookPage (e) {
      const url = '../book/main?isbn=' + e
      wx.navigateTo({ url })
    },
    checkUnserAuthStatus () {
      wx.hideLoading()
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            console.log(res)
            wx.showModal({
              title: '登录失败',
              content: '请点击登录按钮手动登录',
              showCancel: false,
              confirmText: '好'
            })
          } else {
            this.getUserInfo()
          }
        }
      })
    },
    getUserInfo () {
      wx.getUserInfo({
        success: res => {
          this.saveUserInfo(res)
        },
        fail: res => {
          wx.showModal({
            title: '登录失败',
            content: '请点击登录按钮手动登录',
            showCancel: false,
            confirmText: '好'
          })
        }
      })
    },
    login () {
      wx.showLoading({
        title: '正在登录中'
      })
      AV.User.loginWithWeapp()
        .then(user => {
          this.userInfo = user.toJSON()
          this.checkUnserAuthStatus()
        })
        .catch(console.error)
    },
    saveUserInfo (userInfo) {
      const user = AV.User.current()
      user
        .set(userInfo)
        .save()
        .then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          this.userInfo = user.toJSON()
          this.loginStatus = true
          store.commit('setUserInfo', this.userInfo)
          this.getUserCollections()
        })
        .catch(console.error)
    },
    getUserAuth (e) {
      if (e.mp.detail.errMsg === 'getUserInfo:fail auth deny') {
        wx.showModal({
          title: '登录失败',
          content: '请点击登录按钮重试',
          showCancel: false,
          confirmText: '好'
        })
        return
      } else {
        const userInfo = e.mp.detail.userInfo
        this.saveUserInfo(userInfo)
      }
    },
    getUserCollections () {
      usercollection().then(result => {
        this.usercollection = result.map(collection => {
          const year = new Date(collection.createdAt * 1000).getFullYear()
          const month = new Date(collection.createdAt * 1000).getMonth() + 1
          const day = new Date(collection.createdAt * 1000).getDate()
          collection.createdAt = `${year}-${month}-${day}`
          collection.book_name = get14Length(collection.book_name)
          collection.statusText = []
          collection.status.forEach(status => {
            switch (status) {
              case 1:
                collection.statusText.push('在读')
                break
              case 2:
                collection.statusText.push('已读')
                break
              case 3:
                collection.statusText.push('想读')
            }
          })
          return collection
        })
      })
    },
    handleScan (e) {
      wx.scanCode({
        success: res => {
          wx.navigateTo({
            url: '/pages/book/main?isbn=' + res.result
          })
        }
      })
    },
    handleSearch (e) {
      const url = '/pages/search/main?keyword=' + this.keyword
      wx.navigateTo({ url })
    }
  },
  onShareAppMessage (option) {
    console.log(option)
    return {
      title: '我最近在看这本书，一起来啊',
      path: '/pages/index/main',
      success (res) {
        let shareTicket = res.shareTickets[0]
        wx.getShareInfo({
          shareTicket: shareTicket,
          success (errMsg, encryptedData) {
            console.log(errMsg, encryptedData)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.login-btn {
  margin-top: 15px;
}

.tips {
  font-size: 16px;
  margin-top: 20px;
  color: #aaa;
}
.collect-list{
  width: 100%;
  text-align: left;
}
.collect-list-item {
  margin: 10px 0;
}
.collect-list-item span {
  display: inline-block;
  padding: 5px;
  margin: 0 5px;
  font-size: 14px;
}
.collect-list-item span.collect-status {
  font-size: 10px;
  padding: 2px 4px;
  background: #6c6c6c;
  display: inline-block;
  border-radius: 3px;
  color: #fff;
}
.collect-time {
  float: right;
}
.scan-wraper {
  width: 100%;
  display: flex;
  margin: 0 auto;
}
.scan-wraper i {
  line-height: 30px;
  float: left;
}
.scan-wraper .icon-search {
  float: right;
}
.scan-wraper input {
  height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 12px;
  width: 90%;
  border: 1px solid #888;
  margin: 0 10px;
}
</style>
