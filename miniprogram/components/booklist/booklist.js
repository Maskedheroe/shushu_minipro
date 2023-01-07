// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookitem: {
      type: Object
    }
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
    handleClickItem() {
      const {
        bookitem
      } = this.properties
      console.log('1', bookitem);
      wx.navigateTo({
        url: `../../pages/booktrade/booktrade?bookid=${bookitem._id}`,
        // 需要传递发布者信息，物品信息
      })
    }
  }
})