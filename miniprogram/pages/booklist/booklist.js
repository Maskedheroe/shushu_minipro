// pages/playlist/playlist.js
// 交易发布列表页
import throttle from '../../utils/throttle'
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        id: 1,
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        id: 2,
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        id: 3,
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    booklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBookList()
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getBookList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'books',
      data: {
        start: this.data.booklist.length,
        count: MAX_LIMIT,
        $url: 'booklist'
      }
    }).then((res) => {
      this.setData({
        booklist: [...this.data.booklist, ...res.result.data]
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})