// pages/trade-detail/trade-detail.js
import formatTime from '../../utils/formatTime'
import useCollectEffect from './useCollectEffect'
import useCompleteEffect from './useCompleteEffect'
const {
  checkoutCollect,
  handleCollectEvent
} = useCollectEffect()
const { handleCompleteEffect } = useCompleteEffect()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradeInfo: {},
    commentList: [],
    tradeId: '',
    isCollected: false,
    isPublisher: false
  },
  observers: {
    ['isCollected'](isCollected) {
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
      tradeId: options.tradeId,
      isPublisher: options.isPublisher || false
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
      const isPublisher = this.data.tradeInfo._openid === getApp().globalData.openid;
      this.setData({
        isPublisher: `${isPublisher}`
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
  },
  handleDelete() {
    wx.showModal({
      title: '提示',
      content: '是否完成？',
      success: (res) => {
        if (res.confirm) {
          handleCompleteEffect(this.data.tradeId, getCurrentPages)
        } else if (res.cancel) {
          return
        }
      }
    })
  }
})