// pages/wanted/wanted.js
import * as opts from '../../static/filedOpt'
import checkoutField from '../../utils/checkoutFiled'
import throttle from '../../utils/throttle'
import {
  classes
} from '../../static/classes'
import formatTime from '../../utils/formatTime'
const MAX_IMG_NUM = 9

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    showCollegeCate: false,
    showEndTime: false,
    name: '',
    bookCateGory: '',
    bookCateGoryID: '',
    material: '',
    remark: '',
    price: '',
    currentOpt: [],
    bargain: false,
    currentPicker: '',
    fieldNames: {
      text: 'name',
      value: 'id',
      children: 'major'
    },
    imgs: [],
    endTime: '',
    minDate: new Date().getTime(),
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(), // 不提交给后端，组件专门使用
    classes
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handleChooseCate() {
    // TODO 通过设置获取默认学院没做
    this.setData({
      showCollegeCate: true
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
  changebargain({
    detail
  }) {
    this.setData({
      bargain: detail,
    });
  },
  cancelPop() {
    this.setData({
      showCollegeCate: false,
      showPop: false
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
  handleSubmit() {
    const {
      bookCateGory,
      material,
      remark,
      price,
      name,
      bookCateGoryID,
      endTime
    } = this.data
    const isAuthed = checkoutField({
      bookCateGory,
      material,
      remark,
      price,
      name,
      bookCateGoryID,
      endTime
    })
    if (isAuthed) {
      wx.showModal({
        title: '提示',
        content: '是否提交？',
        success: (res) => {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'wanted',
              data: {
                $url: 'add',
                // 组装完整的数据发给后端
                bookinfo: {
                  bookCateGoryInfo: {
                    bookCateGory,
                    bookCateGoryID
                  },
                  material,
                  remark,
                  price,
                  name,
                  endTime,
                  imgs: this.data.imgs,
                  bargain: this.data.bargain
                }
              }
            }).then((res) => {
              wx.showToast({
                title: '发布成功',
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1000);
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

  handleChooseTime() {
    this.setData({
      showEndTime: true
    })
  },
  confirmTime({ detail }) {
    this.setData({
      showEndTime: false,
      endTime: formatTime(new Date(detail)),
      currentDate: detail
    });
  },
  cancelTime() {
    this.setData({
      endTime: '',
      showEndTime: false
    })
  }
})