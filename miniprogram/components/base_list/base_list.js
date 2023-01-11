// components/base_list/base_list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
    isPublisher: {
      type: Boolean
    }
  },
  externalClasses: ['icon-lostandfound', 'iconfont'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick(event) {
      const tradeId = event.currentTarget.dataset.tradeid
      wx.navigateTo({
        url: `../../pages/trade-detail/trade-detail?tradeId=${tradeId}&isPublisher=${this.data.isPublisher}`
      })
    }
  }
})