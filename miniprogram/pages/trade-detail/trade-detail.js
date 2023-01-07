// pages/trade-detail/trade-detail.js
import formatTime from '../../utils/formatTime'
import useCollectEffect from './useCollectEffect'

const {
  checkoutCollect,
  handleCollectEvent
} = useCollectEffect()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradeInfo: {},
    commentList: [],
    tradeId: '',
    isCollected: false
  },
  observers: {
    'isCollected': (isCollected) => {
      this.setData({
        icon_collect: isCollected ? 'icon-start-active' : 'icon-star'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      tradeId: options.tradeId
    })
    await this._getTradeDetail()
    const isCollected = await checkoutCollect(this.data.tradeId)
    this.setData({
      isCollected,
      icon_collect: isCollected ? 'icon-start-active' : 'icon-star'
    })
  },
  async _getTradeDetail() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    await wx.cloud.callFunction({
      name: 'tradeInfo',
      data: {
        tradeId: this.data.tradeId,
        $url: 'detail'
      }
    }).then(res => {
      this.setData({
        tradeInfo: res.result.detail[0],
        commentList: res.result.commentList.data.map((item) => {
          return {
            ...item,
            createTime: formatTime(new Date(item.createTime))
          }
        })
      })
      wx.hideLoading()
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
    const tradeinfo = this.data.tradeInfo
    return {
      title: tradeInfo.content,
      path: `/pages/trade-detail/trade-detail?tradeId=${tradeinfo._id}`
    }
  },
  async handleCollect() {
    // 首先判断是否收藏
    // 如果收藏则取消收藏
    // 未收藏则进行收藏
    const isCollected = await handleCollectEvent(this.data.isCollected, this.data.tradeId)
    // TODO 提示取消收藏
    this.setData({
      isCollected,
      icon_collect: isCollected ? 'icon-start-active' : 'icon-star'
    })
  }
})