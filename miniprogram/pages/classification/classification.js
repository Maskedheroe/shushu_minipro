// pages/classification/classification.js
import {
  classes
} from '../../static/classes.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    classes: classes,
    showMajor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const arr = []
    for (let i = 0, len = classes.length; i < len; i++) {
      if (classes[i].major.length) {
        arr.push(...classes[i].major)
      } else {
        arr.push(classes[i])
      }
    }
    this.setData({
      classes: arr
    })
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

  },
  handleSearch({ detail }) {},
  handleChangeTab({
    detail
  }) {},
  handleChangeSider({
    detail
  }) {
    this.setData({
      showMajor: detail !== 0,
      activeKey: detail === 1 ? 2 : detail
    })
  }
})