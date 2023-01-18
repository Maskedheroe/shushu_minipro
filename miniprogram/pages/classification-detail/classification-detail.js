// pages/classification-detail/classification-detail.js
import useFetchEffect from '../classification/useFetchEffect'

const MAX_LIMIT = 10
const {
  fetch
} = useFetchEffect()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateId: '',
    currentList: [],
    currentTab: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      cateId: options.cateId,
      currentTab: options.currentTab
    })
    this.fetchData()
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
  async fetchData() {
    const classifier = this.data.currentTab
    let res = []
    if (classifier === 'onSale') {
      res = await fetch('books', 'cate-sale', this.data.currentList.length, MAX_LIMIT, this.data.cateId)
    } else {
      res = await fetch('wanted', 'cate-wanted', this.data.currentList.length, MAX_LIMIT, this.data.cateId)
    }
    this.setData({
      currentList: [...this.data.currentList, ...res.data]
    })
  },
})