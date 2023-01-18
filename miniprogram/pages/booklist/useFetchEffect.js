const useFetchEffect = () => {
  const cloud = wx.cloud
  const fetch = async (api, url, start, count) => {
    wx.showLoading({
      title: '加载中',
    })
    const res =  await cloud.callFunction({
      name: api,
      data: {
        start,
        count,
        $url: url
      }
    }).then((res) => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      return res.result  
    })
    return res
  }
  
  return {
    fetch
  }
}
export default useFetchEffect