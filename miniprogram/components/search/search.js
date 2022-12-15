// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeHolder: {
      type: String,
      value: '请输入关键字'
    },
    searchValue: {
      type: String,
      value: ''
    },
    btnName: {
      type: String,
      value: '搜索'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keywords: ''
  },

  observers: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSearch() {
      this.triggerEvent('search', {
        keywords: this.data.keywords
      })
    },
    onChange(e) {
      this.setData({
        keywords: e.detail,
      });
    },
  }
})
