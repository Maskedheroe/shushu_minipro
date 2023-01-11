import formatTime from "../../utils/formatTime"

// pages/losts/losts.js
const MAX_LIMIT = 7
Page({

// lost数据类型
//   {
//      avatarUrl: ""
//      city: ""
//      content: ""
//      country: ""
//      createTime: "2023-01-10T02:46:26.218Z"
//      gender: 0
//      imgs: []
//      language: "zh_CN"
//      nickName: "Vanilet"
//      province: ""
//      role: "FIND_OWNER"
//      _id: "acca0db963bcd1820062db1b6de4f18d"
//      _openid: "o-Auj5ATpXGeQ3eEr4bGjKvQkTDo"
//   }

  /**
   * 页面的初始数据
   */
  data: {
    losts_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._getLostsList()
  },
  async _getLostsList(start = 0) {
    wx.showLoading({
      title: '加载中',
    })
    const res = await wx.cloud.callFunction({
      name: 'tradeInfo',
      data: {
        start,
        count: MAX_LIMIT,
        $url: 'lost_record'
      }
    }).then((res) => {
      return res.result.data
    })
    this.setData({
      losts_list: [...this.data.losts_list, ...res.data].map((item) => {
        return {
          ...item,
          createTime: formatTime(new Date(item.createTime))
        }
      })
    })
    wx.stopPullDownRefresh()
    wx.hideLoading()
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
      losts_list: []
    })
    this._getLostsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this._getLostsList(this.data.losts_list.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})