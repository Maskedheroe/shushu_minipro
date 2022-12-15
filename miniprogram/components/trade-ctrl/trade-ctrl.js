// components/trade-ctrl/trade-ctrl.js
let mUserInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tradeId: String
  },
  externalClasses: ['icon-share_light', 'icon-comment', "iconfont"],
  /**
   * 组件的初始数据
   */
  data: {
    showPop: false,
    content: '',
    showComment: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      this.handleGetAuth()
    },
    handleLoginFail() {
      wx.showModal({
        title: '授权用户才能发布',
        content: ''
      })
    },
    handleLoginSuccess(userInfo) { // 该方法是子组件抛上来的
      mUserInfo = userInfo
      this.handleShowCommentModal()
    },
    onClose() {
      this.setData({
        showPop: false
      });
    },
    handleGetAuth() {
      wx.getSetting({
        success: (res) => {
          wx.getUserInfo({
            success: (res) => {
              if (!res.userInfo === '微信用户') { // 校验是否设置用户名和昵称
                this.setData({
                  showPop: true
                })
              } else {
                return this.handleLoginSuccess(res.userInfo)
              }
            }
          })
        }
      })
    },
    //  评论业务逻辑
    handleShowCommentModal() {
      this.setData({
        showComment: true
      })
    },
    onCloseComment() {
      this.setData({
        showComment: false
      })
    },
    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },
    handleSend(event) {
      // 插入数据库
      const content = event.detail.value.content
      const formId = event.detail.formId
      if (content.trim() === '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: ''
        })
        return
      }
      // 推送模板消息
      wx.showLoading({
        title: '评价中',
        mask: true
      })
      db.collection('trade-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          tradeId: this.properties.tradeId,
          nickName: mUserInfo.nickName,
          avatarUrl: mUserInfo.avatarUrl
        }
      }).then((res) => {
        wx.cloud.callFunction({
          name: 'sendCommentMsg',
          data: {
            content,
            formId,
            tradeId: this.properties.tradeId
          }
        }).then((res) => {
          console.log(res);
        })
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          showComment: false,
          content: ''
        })
      })
    }
  }
})