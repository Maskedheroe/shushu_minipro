// app.js
App({
  //testa
  //shushu
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-4glau5n8dba75155',
        traceUser: true,
      });
    }

    this.globalData = {
      openid: -1
    };
    this.getOpenid()
  },
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      console.log('od', openid);
      this.globalData.openid = openid
      wx.getStorage({
        key: openid,
        complete: (res) => {
          if (!res || !res.data) {
            wx.setStorage({
              key: openid,
              data: []
            })
          }
        }
      })
    })
  }
});