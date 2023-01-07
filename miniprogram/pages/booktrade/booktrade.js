// pages/booktrade/booktrade.js
// 交易卡片详情页
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { bookid } = options
    this.saveTradeHistory(bookid)
  },
  saveTradeHistory(bookid){
    const openid = getApp().globalData.openid
    wx.getStorage({
      key: openid,
      success: (res) => {
        const arr = res.data
        arr.unshift(bookid)
        const newHistory = [...new Set(arr)] // 去重
        wx.setStorage({
          key: openid,
          data: newHistory
        })
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})