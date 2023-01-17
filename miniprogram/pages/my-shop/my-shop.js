// pages/my-shop/my-shop.js
import useFetchEffect from './useFetchEffect'

const {
  fetch
} = useFetchEffect()
const MAX_LIMIT = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '',
    booklist: [],
    wantedList: [],
    currentList: [],
    isReady: false // 防止快速操作tab
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      currentTab: 'onSale'
    })
    this.fetchData('onSale')
  },
  onPullDownRefresh() {
    this.fetchData(this.data.currentTab)
  },
  handleChangeClassifier({
    detail: {
      classifier
    }
  }) {
    // 切换前先清空
    this.setData({
      currentList: [],
      wantedList: [],
      booklist: [],
      isReady: false,
      currentTab: classifier
    })
    this.fetchData(classifier)
  },
  async fetchData(classifier) {
    let res = []
    if (classifier === 'onSale') {
      res = await fetch('books', 'mysale', this.data.booklist.length, MAX_LIMIT)
      this.setData({
        booklist: [...this.data.booklist, ...res.data]
      })
    } else {
      res = await fetch('wanted', 'mywanted', this.data.wantedList.length, MAX_LIMIT)
      this.setData({
        wantedList: [...this.data.wantedList, ...res.data]
      })
    }
    this.setData({
      currentList: this.data.currentTab === 'onSale' ? this.data.booklist : this.data.wantedList
    })
    setTimeout(() => {
      this.setData({
        isReady: true
      })
    }, 1000)
  },
  handleClick() {
    console.log('click');
  }
})