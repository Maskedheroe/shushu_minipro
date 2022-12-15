// components/publish/publish.js
import throttle from '../../utils/throttle'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
      this.handleGetAuth()
    },
    showPopup() {
      this.setData({
        showPop: true
      });
    },
    onClose() {
      this.setData({
        showPop: false
      });
    },
    handleLoginFail() {
      wx.showModal({
        title: '授权用户才能发布',
        content: ''
      })
    },
    handleLoginSuccess(userInfo) { // 该方法是子组件抛上来的
      this._handleGetUserInfoSuccess(userInfo)
    },
    handleGetAuth() { // 授权主逻辑
      wx.getSetting({
        success: (res) => {
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              success: (res) => {
                return this.handleLoginSuccess(res.userInfo)
              }
            })
          } else {
            this.setData({
              showPop: true
            })
          }
        }
      })
    },
    _handleGetUserInfoSuccess(userInfo) {
      const bundleRes = JSON.stringify(userInfo)
      wx.navigateTo({
        url: `../../pages/trade-edit/trade-edit?info=${bundleRes}`,
      })
    }
  }
})