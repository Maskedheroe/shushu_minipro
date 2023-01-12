// components/classifier/classifier.js
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
    active: 0,  // 初试选择
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail.name
      this.triggerEvent('changeClassifier', {
        classifier: event.detail.name
      }) 
    },
  }
})
