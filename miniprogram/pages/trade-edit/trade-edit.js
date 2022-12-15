// pages/trade-edit/trade-edit.js
import useUploadEffect from './useUploadEffect'
import Dialog from '@vant/weapp/dialog/dialog';

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
    selectPhoto: true, // 添加图片标识是否显示
    content: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = JSON.parse(options.info)
    this.setData({
      userInfo
    })
  },
  onInput(event) {
    const words = event.detail.value || ''
    let wordsNum = words.length
    wordsNum >= MAX_WORDS_NUM ? wordsNum = `最大字数为${MAX_WORDS_NUM}` : this.setData({
      wordsNum
    })
    this.setData({
      content: words
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
  },
  handleSend() {
    // 发布主流程 文字+用户信息(openId、昵称、头像、时间)发送至数据库中储存
    // 图片发送至云存储中存储，获得 fileId
    // 图片fileId存至相对应用户数据库中
    if (!this.data.content.trim()) { // 校验内容
      wx.showModal({
        title: '请输入内容',
        content: ''
      })
      return
    }
    const {
      saveTocloudFiles,
      saveToDataBase,
      backAndRefresh
    } = useUploadEffect(this.data.imgs) // 用一个hook控制发布主流程
    Dialog.confirm({
        title: '发布',
        message: '要发布吗？'
      })
      .then(async () => {
        wx.showLoading({
          title: '发布中',
          mask: true
        })
        const {
          promiseArr,
          fileIds
        } = await saveTocloudFiles() 
        await saveToDataBase(this.data.content, this.data.userInfo, promiseArr, fileIds)
        backAndRefresh(getCurrentPages)
      })
      .catch((error) => {
        wx.hideLoading()
        wx.showToast({
          title: '当前发布失败',
          icon: 'error'
        })
      });
  },
})