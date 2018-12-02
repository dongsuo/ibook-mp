<template>
    <div class="container">
      <ul>
        <li class="book-info" v-for="(item, index) in bookList" :key="index">
          <navigator :url="'/pages/book/main?isbn='+item.isbn13" hover-class="navigator-hover">
            <img :src="item.images.small" mode='aspectFit'>
            <div class="book-info-item">
              <h1 class="book-title">{{item.title}}</h1>
              <p>作者：{{item.author}}</p>
              <p>豆瓣评分：{{item.rating.average}}分/[{{item.rating.numRaters}}人]</p>
              <p>出版时间：{{item.pubdate}}</p>
            </div>
          </navigator>
          <div class="operate-area">
            <div class="operate-item" @click="collectBook(item)">
              <i class="iconfont icon-shoucang"></i>
              <span>标记</span>
            </div>
            <div class="operate-item">
              <button open-type="share" size="mini"	plain="true" :data-bookInfo="item" style="border:0px;line-height:inherit;">
                <i class="iconfont icon-sharearrow"></i>
                <span>分享</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>
   
<script>
import rating from '@/components/rating'
import { search } from '@/api/searchBook'
import { addBook } from '@/api/addbook'

export default {
  components: { rating },
  data () {
    return {
      bookList: []
    }
  },
  onReady () {
    wx.showLoading({
      title: 'Loading'
    })
    search(this.$mp.query).then(data => {
      wx.hideLoading()
      this.bookList = data.books
    })
  },
  onShareAppMessage (option) {
    if (option.target) {
      return {
        title: '这本书你说吼不吼哇，一起来读啊',
        path: '/pages/book/main?isbn=' + option.target.dataset.bookinfo.isbn13,
        imageUrl: option.target.dataset.bookinfo.images.medium,
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
  },
  methods: {
    collectBook (book) {
      wx.showActionSheet({
        itemList: ['在读', '已读', '想读'],
        success: (e) => {
          const data = {
            isbn: book.isbn13,
            book_name: book.title,
            image: book.image,
            status: e.tapIndex + 1
          }
          addBook(data).then(res => {
            if (res.code !== 20000) {
              this.handleUnLogin(res.message)
            }
            if (res.data.status === 'added') {
              wx.showToast({
                title: '已经标记过啦',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '标记成功！',
                icon: 'success'
              })
            }
          })
        }
      })
    },
    handleUnLogin (message) {
      wx.showModal({
        title: '操作失败',
        content: `${message}` || 'Oops, 有点小问题',
        showCancel: true,
        confirmText: '返回首页',
        success: (res) => {
          if (res.confirm) {
            wx.redirectTo({ url: '/pages/index/main' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
ul{
  width: 100%;
}
.book-info{
  margin-bottom: 10px;
  padding: 15px 10px;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}
.book-info navigator::after{
  content: '';
  display: block;
  clear: both;
}
.book-info img{
  width: 38.2%;
  height: 160px;
  float: left;
  margin-right: 10px;
}

.book-info-item p{
  font-size: 14px;
  color: #aaa;
}
.book-title{
  color: #00A9BA;
  font-size: 18px;
}
.operate-area{
  margin: 0 auto;
  margin-top: 10px;
  padding-top: 5px;
  border-top: 1px solid #c6c6c6;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.operate-item{
  text-align: center;
  min-width: 100px;
  font-size: 13px;
  height: 25px;
  line-height: 25px;
  display: inline-block;
}
.operate-item i{
  display: inline;
  margin-right: 5px;
}
</style>