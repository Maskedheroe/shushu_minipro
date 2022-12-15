// components/loginAuth/loginAuth.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleGetUserInfo(event) {
      const { detail: { useInfo } } = event
      if (useInfo) { // 允许授权
        this.triggerEvent('loginSuccess', {
          showPop: false,
          useInfo
        })
      } else { // 拒绝授权
        this.triggerEvent('loginFail')
      }
    },
    handleClick() {
      console.log('1111');
    }
  }
})
