// components/publish/publish.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navUrl: {
      type: String
    },
    role: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPop: false
  },
  externalClasses: [
    "iconfont",
    "icon-fabu"
  ],
  /**
   * 组件的方法列表
   */
  methods: {
    handlePublish() {
      // 业务主逻辑
      // TODO 防抖没做
      wx.navigateTo({
        url: `../../pages/${this.properties.navUrl}`
      })
    }
  }
})