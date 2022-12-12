// pages/trade-edit/trade-edit.js
// 输入文字最大长度
const MAX_WORDS_NUM = 150
// 最大图片数量
const MAX_IMG_NUM = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    imgs: [],
    selectPhoto: true // 添加图片标识是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      nickName
    } = JSON.parse(options.info)
  },
  onInput(event) {
    const words = event.detail.value || ''
    let wordsNum = words.length
    wordsNum >= MAX_WORDS_NUM ? wordsNum = `最大字数为${MAX_WORDS_NUM}` : this.setData({
      wordsNum
    })
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  handleChooseImg() {
    let maxChoose = MAX_IMG_NUM - this.data.imgs.length
    wx.chooseMedia({
      count: maxChoose,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imgs: [...this.data.imgs, ...res.tempFiles.map((item) => {
            return item.tempFilePath
          })]
        })
        // 还能再选几张图片
        maxChoose = MAX_IMG_NUM - this.data.imgs.length
        this.setData({
          selectPhoto: maxChoose <= 0 ? false : true
        })
      }
    })
  },
  handleDeleteImg(event) {
    const index = event.target.dataset.index
    const newImgSet = [...this.data.imgs]
    newImgSet.splice(index, 1)
    this.setData({
      imgs: newImgSet
    })
    if (this.data.imgs.length < MAX_IMG_NUM) {
      this.setData({
        selectPhoto: true
      })
    }
  },
  onhandlePreview(event) {
    const current = event.target.dataset.imgsrc
    wx.previewImage({
      urls: this.data.imgs,
      current
    })
  }
})