<template>
    <div class="container">
      <div class="book-info">
        <div class="title">{{bookInfo.title}}</div>
        <img :src="bookInfo.image" mode='aspectFit' alt="">
        <p class="rating-wrap"><rating :rating="rating"/></p>
        <p class="bookinfo-item">作者：{{bookInfo.author}}</p>
        <p class="bookinfo-item" v-if="bookInfo.translator">译者：{{bookInfo.translator}}</p>
        <p class="bookinfo-item">出版社：{{bookInfo.publisher}}</p>
        <p class="bookinfo-item">出版时间：{{bookInfo.pubdate}}</p>
        <p class="bookinfo-item">页数：{{bookInfo.pages}}页</p>
        <p class="bookinfo-item">定价：{{bookInfo.price}}</p>
        <p class="bookinfo-status">
          <span v-bind:class="[status.reading?'active':'inactive']" @click="collectBook(1)">在读</span>
          <span v-bind:class="[status.readed?'active':'inactive']" @click="collectBook(2)">已读</span>
          <span v-bind:class="[status.willread?'active':'inactive']" @click="collectBook(3)">想读</span>
          <!-- <span v-for="(item,index) in status" :key="index">{{item}}</span> -->
        </p>
      </div>
      <div class="wrap">
        <mpvue-echarts :ec="ec" :bookInfo="bookInfo" :share="share"></mpvue-echarts>
      </div>
      
      <div class="operate-area">
            <div class="operate-item" @click="collectBook()">
              <i class="iconfont icon-shoucang"></i>
              <span>标记</span>
            </div>
            <div class="operate-item" @click="handleShare()">
              <i class="iconfont icon-sharearrow"></i>
              <span>生成图片分享</span>
            </div>
          </div>
    </div>
</template>
   
<script>
// 引入新组件后请检查并更新echarts组件的index值
import mpvueEcharts from '@/components/mpvueEcharts/index'
import rating from '@/components/rating'
import { getBookInfo } from '@/api/bookInfo'
import { addBook } from '@/api/addbook'

var option = {
  showLoading: true,
  color: ['#00A9BA'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['tag'],
    show: false
  },
  grid: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    containLabel: true
  },
  radar: {
        // shape: 'circle',
    name: {
      textStyle: {
        color: '#000'
      }
    },
    splitArea: {
      show: false
    },
    indicator: [],
    radius: 80,
    center: ['50%', '61.8%']
  },
  series: [
    {
      name: 'tag',
      type: 'radar',
      label: {
        normal: {
          show: true
        }
      },
      data: []
      // itemStyle: {normal: {areaStyle: {type: 'default'}}}
    }
  ]
}
let chart
function initChart (canvas, width, height, echarts) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  chart.setOption(option)
  return chart
}

export default {
  components: { mpvueEcharts, rating },
  data () {
    return {
      bookInfo: {},
      ec: {
        lazyLoad: true,
        onInit: initChart
      },
      rating: 0,
      status: {
        reading: false,
        readed: false,
        willread: false
      },
      share: false
    }
  },
  onReady () {
    this.getBookInfo()
  },
  onUnload () {
    this.bookInfo = {}
    this.rating = 0
    this.status = {
      reading: false,
      readed: false,
      willread: false
    }
  },
  methods: {
    getBookInfo () {
      wx.showLoading()
      getBookInfo(this.$mp.query.isbn).then(data => {
        data.translator = data.translator.join(',')
        this.rating = data.rating
        this.status = {
          reading: false,
          readed: false,
          willread: false
        }
        if (data.status) {
          data.status.forEach(status => {
            if (status === 1) {
              this.status.reading = true
            } else if (status === 2) {
              this.status.readed = true
            } else if (status === 3) {
              this.status.willread = true
            }
          })
        }
        if (data.price.indexOf('元') < 0) {
          data.price += '元'
        }
        this.bookInfo = data
        const tagNames = []
        const tagCount = []
        data.tags.forEach(tag => {
          tagNames.push({name: tag.name, max: data.tags[0].count / 2})
          tagCount.push(tag.count)
        })
        option.series[0].data = [{ value: tagCount, name: 'tag' }]
        option.radar.indicator = tagNames
        this.$children[1].init()
        wx.hideLoading()
      })
    },
    addBook (index) {
      const data = {
        isbn: this.bookInfo.isbn13,
        image: this.bookInfo.image,
        book_name: this.bookInfo.title,
        status: index
      }
      addBook(data).then(res => {
        if (res.message === 'removed') {
          wx.showToast({
            title: '已移除',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '标记成功！',
            icon: 'success'
          })
        }
        this.getBookInfo()
      })
    },
    collectBook (id) {
      if (id) {
        this.addBook(id)
      } else {
        wx.showActionSheet({
          itemList: ['在读', '已读', '想读'],
          success: (e) => {
            this.addBook(e.tapIndex + 1)
          }
        })
      }
    },
    handleShare () {
      this.share = !this.share
    }
  }
}
</script>

<style scoped>
.book-info{
  padding: 0 10px;
}

.wrap {
  width: 100%;
  height: 400px;
  margin: 10px 0;
  /* transform: rotate(90deg); */
}
.rating-wrap{
  position: relative;
  margin-left: 15px;
}

.title{
  text-align: center;
  color: #494949;
  font-weight: bold;
  font-size: 18px;
  margin: 10px;
  padding: 5px;
}
.bookinfo-item {
  font-size: 13px;
  margin: 12px 15px;
  color: #aaa;
}
.link-to-index {
  display: inline-block;
  padding: 5px 10px;
  color: #00A9BA;
  border: 1px solid #00A9BA;
}
button {
  display: inline-block;
  margin: 10px;
  line-height: 2;
  font-size: 14px;
}

.bookinfo-status .active{
  background: #00A9BA;
  border: 1px solid #00A9BA;
  font-size: 13px;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
}
.bookinfo-status .inactive{
  background: #c6c6c6;
  border: 1px solid #c6c6c6;
  font-size: 13px;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
}

.operate-area{
  margin: 0 auto;
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid #c6c6c6;
  height: 25px;
  width: 61.8%;
  line-height: 25px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.operate-item{
  display: inline-block;
}
.operate-item i{
  display: inline;
  margin-right: 5px;
}
</style>