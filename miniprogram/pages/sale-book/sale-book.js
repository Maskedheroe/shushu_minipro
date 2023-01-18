// pages/sale-book/sale-book.js
import * as opts from '../../static/filedOpt'
import checkoutField from '../../utils/checkoutFiled'
import throttle from '../../utils/throttle'
import saveTocloudFiles from '../../utils/saveImgs'
import {
  classes
} from '../../static/classes'

const MAX_IMG_NUM = 9
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    showCollegeCate: false,
    grade: '',
    address: '',
    bookCateGory: '',
    bookCateGoryID: '',
    old: '',
    note: '',
    material: '',
    remark: '',
    price: '',
    name: '',
    bargain: false,
    currentOpt: [],
    form: {},
    currentPicker: '', // 目前选择哪条表单在填写
    imgs: [],
    term: '',
    fieldNames: {
      text: 'name',
      value: 'id',
      children: 'major'
    },
    userInfo: {},
    classes
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
  onShow() {
    const {
      userInfo,
      hasUserInfo
    } = app.globalData.user
    if (!hasUserInfo) {
      wx.navigateTo({
        url: '/pages/apply-auth/apply-auth',
      })
    }
    this.setData({
      userInfo
    })
  },
  handleChooseCate() {
    // TODO 通过设置获取默认学院没做
    this.setData({
      showCollegeCate: true
    })
  },
  handleFinishCollegeCate(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    const bookCateGory = selectedOptions.find(cate => cate.id === value)?.name
    this.setData({
      bookCateGory,
      showCollegeCate: false,
      bookCateGoryID: value,
      showPop: false,
    })
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
  confirmPicker({
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
      showCollegeCate: false,
      showPop: false
    })
  },
  // 图片上传方法
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
  // 图片上传方法

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
      term,
      bookCateGoryID
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
      name,
      term
    })
    if (isAuthed) {
      wx.showModal({
        title: '提示',
        content: '是否提交？',
        success: async (res) => {
          if (res.confirm) {
            const {
              promiseArr,
              fileIds
            } = await saveTocloudFiles(this.data.imgs)
            Promise.all(promiseArr).then((res) => {
              wx.cloud.callFunction({
                name: 'books',
                data: {
                  $url: 'add',
                  // 组装完整的数据发给后端
                  bookinfo: {
                    grade,
                    address,
                    bookCateGoryInfo: {
                      bookCateGory,
                      bookCateGoryID
                    },
                    old,
                    note,
                    material,
                    remark,
                    price,
                    name,
                    term,
                    bargain: this.data.bargain,
                    imgs: fileIds,
                    userInfo: this.data.userInfo
                  }
                }
              }).then((res) => {
                this.hint()
              })
            })
          } else if (res.cancel) {
            return
          }
        }
      })
    } else {
      wx.showToast({
        title: '信息未填写完整',
        icon: 'error'
      })
    }
  },
  hint() {
    wx.showToast({
      title: '发布成功',
    })
    setTimeout(() => {
      console.log('2222');
      wx.navigateBack()
    }, 1000);
  },
  changebargain({
    detail
  }) {
    this.setData({
      bargain: detail,
    });
  }
})