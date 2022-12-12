const useUploadEffect = (imgs) => {
  const db = wx.cloud.database()

  const fileIds = []

  const popUpDialog = () => {
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
        console.log('err', err);
        wx.hideLoading()
        wx.showToast({
          title: '当前发布失败',
          icon: 'error'
        })
      })
    })
  }
  return {
    popUpDialog,
    saveToDataBase
  }
}

export default useUploadEffect