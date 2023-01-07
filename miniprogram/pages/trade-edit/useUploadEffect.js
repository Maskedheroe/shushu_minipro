const useUploadEffect = (imgs) => {
  const db = wx.cloud.database()

  const fileIds = []

  const saveTocloudFiles = () => {
    const promiseArr = []
    for (const item of imgs) {
      const p = new Promise((resolve, reject) => {
        const suffix = /\.\w+$/.exec(item)
        wx.cloud.uploadFile({
          cloudPath: 'trade-information/' + Date.now() + '-' + Math.random() * 100000000 + suffix,
          filePath: item,
          success: (res) => {
            fileIds.push(res.fileID)
            resolve()
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
      promiseArr.push(p)
    }
    return {
      promiseArr,
      fileIds
    }
  }
  // 存储到云数据库
  const saveToDataBase = (contentText, userInfo, promiseArr, fileIds) => {
    return Promise.all(promiseArr).then((res) => {
      db.collection('trade-infomation').add({
        data: {
          ...userInfo,
          content: contentText,
          imgs: fileIds,
          createTime: db.serverDate() // 获取服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
      }).catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '当前发布失败',
          icon: 'error'
        })
      })
    })
  }
  const backAndRefresh = (getCurrentPages) => {
    // 成功之后返回trade-find页面
    wx.navigateBack()
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.onPullDownRefresh()
  }
  return {
    saveTocloudFiles,
    saveToDataBase,
    backAndRefresh
  }
}

export default useUploadEffect