const fileIds = []
const saveTocloudFiles = (imgs) => {
  const promiseArr = []
  for (const item of imgs) {
    const p = new Promise((resolve, reject) => {
      const suffix = /\.\w+$/.exec(item)
      wx.cloud.uploadFile({
        cloudPath: 'images/' + Date.now() + '-' + Math.random() * 100000000 + suffix,
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
export default saveTocloudFiles