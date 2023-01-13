// pages/playlist/playlist.js
// 交易发布列表页
import throttle from '../../utils/throttle'

const db = wx.cloud.database()
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [],
    booklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBookList()
    this._fetchSwiper()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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
    this.getBookList(detail.classifier, true)
  },
  getBookList(classify = 'onSale', changeClassifier = false) {
    wx.showLoading({
      title: '加载中',
    })
    changeClassifier && this.setData({
      booklist: []
    });
    wx.cloud.callFunction({
      name: 'books',
      data: {
        start: this.data.booklist.length,
        count: MAX_LIMIT,
        $url: 'booklist',
        classify
      }
    }).then((res) => {
      this.setData({
        booklist: [...this.data.booklist, ...res.result.data]
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  handleSearch({ detail }) {
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