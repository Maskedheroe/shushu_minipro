// pages/playlist/playlist.js
// 交易发布列表页
import throttle from '../../utils/throttle'
import useFetchEffect from './useFetchEffect'
const db = wx.cloud.database()
const MAX_LIMIT = 15

const {
  fetch
} = useFetchEffect()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [],
    booklist: [],
    wantedList: [],
    currentList: [],
    currentTab: 'onSale',
    tabIsReay: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBookList()
    this._fetchSwiper()
  },
  onShow() {
    const { userInfo, hasUserInfo } = app.globalData.user
    if (!hasUserInfo) {
      wx.navigateTo({
        url: '/pages/apply-auth/apply-auth',
      })
    }
    this.setData({
      userInfo
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    throttle(this.getBookList, 1000)()
    this._fetchSwiper()
  },
  handlePullDownRefresh() {
    this.setData({
      booklist: []
    })
    this.getBookList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 加入防抖 避免多次请求
    const getBooksWithThrottle = throttle(this.getBookList, 500)
    getBooksWithThrottle()
  },
  /**
   * @param { e: { detail: string } } tab 对应的标识 有onSale和buy 
   */
  handleChangeClassifier({
    detail
  }) {
    // console.log('detail', e.detail);
    // 请求后端查找不同分类商品 后端接口是books
    // this.getBookList(detail.classifier, true)
    this.setData({
      currentTab: detail.classifier,
      currentList: []
    })
    this.getBookList()
  },
  async getBookList() {
    let res = []
    if (this.data.currentTab === 'onSale') {
      res = await fetch('books', 'allsale', this.data.booklist.length, MAX_LIMIT)
      this.setData({
        booklist: [...this.data.booklist, ...res.data]
      })
    } else {
      res = await fetch('wanted', 'allwanted', this.data.wantedList.length, MAX_LIMIT)
      this.setData({
        wantedList: [...this.data.wantedList, ...res.data]
      })
    }
    this.setData({
      currentList: this.data.currentTab === 'onSale' ? this.data.booklist : this.data.wantedList
    })
    setTimeout(() => {
      this.setData({
        tabIsReay: true
      })
    }, 1000)
  },
  handleSearch({
    detail
  }) {
    // TODO shushu_19
  },
  _fetchSwiper() {
    db.collection('swiper').get().then((res) => {
      this.setData({
        swiperImgUrls: res.data
      })
    })
  }
})