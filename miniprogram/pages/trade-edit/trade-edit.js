// pages/trade-edit/trade-edit.js

// 失物招领编辑页面

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._handleAuth() // 获取用户信息
  },
  _handleAuth() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          wx.showModal({
            title: '提示',
            content: '需要获取用户信息',
            success: (res) => {
              if (res.confirm) {
                wx.getUserProfile({
                  desc: '用于完善会员资料',
                  success: (res) => {
                    this.setData({
                      userInfo: res.userInfo
                    })
                  },
                  fail: (res) => {
                    console.log('fail', res);
                  }
                })
              } else if (res.cancel) {
                wx.switchTab({
                  url: '/pages/trade-find/trade-find'
                })
              }
            }
          })
        }
      }
    })
  }
})