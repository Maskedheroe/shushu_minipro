// pages/lost-find/lost-find.js
const REQUEST_TRADEINFO_COUNT = 10
// 失物招领界面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradeList: [],
    navUrl: 'lost-edit/lost-edit'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._loadTradeList()
  },
  async _loadTradeList(start = 0, keywords = '') {
    wx.showLoading({
      title: '拼命加载中',
    })
    const res = await wx.cloud.callFunction({
      name: 'tradeInfo',
      data: {
        keywords,
        start,
        count: REQUEST_TRADEINFO_COUNT,
        $url: 'list'
      }
    })
    console.log('ssss', res);
    const {
      result
    } = res
    if (result.code === 200) {
      this.setData({
        tradeList: [...this.data.tradeList, ...result.data.data]
      })
    } // TODO 请求失败逻辑没做
    wx.hideLoading()
  },
  handleComment(event) {
    const tradeId = event.target.dataset.tradeid
    wx.navigateTo({
      url: `../trade-detail/trade-detail?tradeId=${tradeId}`,
    })
  },
  handleSearch(event) {
    const keywords = event.detail.keywords
    this.setData({
      tradeList: []
    })
    this._loadTradeList(0, keywords)
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
    this.setData({
      tradeList: []
    })
    this._loadTradeList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const start = this.data.tradeList.length
    this._loadTradeList(start)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(event) {
    const {
      tradeinfo
    } = event.target.dataset
    return {
      title: tradeinfo.content,
      path: `/pages/trade-detail/trade-detail?tradeId=${tradeinfo._id}`,
    }
  }
})