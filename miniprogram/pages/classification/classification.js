// pages/classification/classification.js
import {
  simpleClasses
} from '../../static/simpleClasses.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    classes: [{
      id: '00',
      name: '公共课'
    }, ...simpleClasses],
    isReady: false,
    currentTab: 'onSale',
    currentSide: {
      sideId: '00',
      sideName: '公共课'
    },
    currentMajor: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      isReady: true,
      activeKey: 0
    })
    this.fetchMajor(this.data.currentSide.sideName)
  },
  handleSearch({
    detail
  }) {},
  handleChangeTab({
    detail
  }) {
    this.setData({
      currentTab: detail.classifier,
      activeKey: 0,
      currentSide: {
        sideId: '00',
        sideName: '公共课'
      }
    })
    this.fetchMajor(this.data.currentSide.sideName)
  },
  handleClickItem({
    currentTarget: {
      dataset: {
        info // 最后解构出info使用
      }
    }
  }) {
    // 先清空数据
    this.setData({
      currentSide: info === '公共课' ? {
        sideId: '00',
        sideName: info
      } : {
        sideId: info.id,
        sideName: info.name
      }
    })
    // 请求后端
    this.fetchMajor(this.data.currentSide.sideName)
    // this.fetchData(this.data.currentTab)
  },
  fetchMajor(collegeName) {
    if (collegeName === '公共课') {
      this.setData({
        currentMajor: [{
          id: '00',
          name: '所有公共课类'
        }]
      })
      return
    }
    const college = simpleClasses.find((college) => college.name === collegeName)
    this.setData({
      currentMajor: [...college.major]
    })
  },
  handleClickMajor({
    currentTarget: {
      dataset
    }
  }) {
    const cateId = dataset.info.id
    const currentTab = this.data.currentTab
    if (cateId === '00') {
      this.handleGoCommon()
    }
    wx.navigateTo({
      url: `/pages/classification-detail/classification-detail?cateId=${cateId}&currentTab=${currentTab}`,
    })
  },
  handleGoCommon() {
    const cateId = '00'
    const currentTab = this.data.currentTab
    wx.navigateTo({
      url: `/pages/classification-detail/classification-detail?cateId=${cateId}&currentTab=${currentTab}`,
    })
  },
  onChange({detail}) {
    this.setData({
      activeKey: detail
    })
  },
})