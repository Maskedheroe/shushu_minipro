// components/tradeCard/tradeCard.js
import formatTime from '../../utils/formatTime'

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
  observers: {
    ['tradeitem.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})