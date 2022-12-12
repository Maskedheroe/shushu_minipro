// components/tradeCard/tradeCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tradeitem: {
      type: Object,
      default: {}
    }
  },

  attached() {
    console.log(this.properties.tradeitem);
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

  }
})
