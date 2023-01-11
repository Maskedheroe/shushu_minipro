// components/info-edit/infor-edit.js
// 基础交易信息编辑组件
import useUploadEffect from '../../components/info-edit/useUploadEffect'
import Dialog from '@vant/weapp/dialog/dialog';
import {
  FIND_OWNER,
  FIND_THINS,
  FINDER,
  LOSTER
} from '../../static/role'
// 输入文字最大长度
const MAX_WORDS_NUM = 150
// 最大图片数量
const MAX_IMG_NUM = 9

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {},
    role: {
      type: String,
      observer: function (newVal, oldVal) {
        this.setData({
          hint: newVal === 'FIND_OWNER' ? FIND_OWNER : FIND_THINS
        })
      }
    }
  },
  externalClasses: ["iconfont", "icon-delete", "icon-add"],
  /**
   * 组件的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    imgs: [],
    selectPhoto: true, // 添加图片标识是否显示
    content: '',
    hint: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
          context: this,
          title: '发布',
          message: '要发布吗？',
          selector: '#van-dialog'
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
          await saveToDataBase(this.data.content, this.properties.userInfo, promiseArr, fileIds, this.properties.role)
          // 发布成功，清空当前页面数据
          backAndRefresh(getCurrentPages)
        })
    }
  }
})