// pages/sale-book/sale-book.js
import * as opts from '../../static/filedOpt'
import checkoutField from '../../utils/checkoutFiled'
import throttle from '../../utils/throttle'
const MAX_IMG_NUM = 9

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    cascaderValue: '',
    grade: '',
    address: '',
    bookCateGory: '',
    old: '',
    note: '',
    material: '',
    remark: '',
    price: '',
    name: '',
    bargain: false,
    currentOpt: [],
    form: {},
    currentPicker: '',
    imgs: [],
    term: ''
    // gradeOpt,
    // addressOpt: address,
    // bookCateGoryOpt: bookCateGory,
    // oldOpt: old,
    // noteOpt: note,
    // materialOpt: material,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 节流优化setData
  handleChange: throttle(function ({
    currentTarget: {
      dataset
    },
    detail
  }) {
    this.setData({
      [dataset.label]: detail
    })
  }, 100),
  handleChoice(e) {
    const {
      label
    } = e.currentTarget.dataset
    this.setData({
      showPop: true,
      currentOpt: opts[label],
      currentPicker: label
    })
  },
  closePop({
    detail: {
      value
    }
  }) {
    const currentPicker = this.data.currentPicker
    this.setData({
      showPop: false,
      [currentPicker]: value.text
    });
  },
  cancelPop() {
    this.setData({
      showPop: false
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
  onhandlePreview(event) {
    const current = event.target.dataset.imgsrc
    wx.previewImage({
      urls: this.data.imgs,
      current
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
  // 提交表单方法
  handleSubmit() {
    const {
      grade,
      address,
      bookCateGory,
      old,
      note,
      material,
      remark,
      price,
      name,
      term
    } = this.data
    const isAuthed = checkoutField({
      grade,
      address,
      bookCateGory,
      old,
      note,
      material,
      remark,
      price,
      name
    })
    if (isAuthed) {
      // 进行request
      wx.cloud.callFunction({
        name: 'books',
        data: {
          $url: 'add',
          bookinfo: {
            grade,
            address,
            bookCateGory,
            old,
            note,
            material,
            remark,
            price,
            name,
            term,
            bargain: this.data.bargain
          }
        }
      }).then((res) => {
        console.log('okres', res);
      })
    } else {
      console.log('err', '未满足表单')
    }
  },
  changebargain({
    detail
  }) {
    this.setData({
      bargain: detail,
    });
  }
})