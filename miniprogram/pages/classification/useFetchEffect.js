const useFetchEffect = () => {
  const cloud = wx.cloud
  const fetch = async (api, url, start, count, cateId) => {
    console.log('idd', cateId);
    wx.showLoading({
      title: '加载中',
    })
    const res =  await cloud.callFunction({
      name: api,
      data: {
        start,
        count,
        bookCateGoryId: cateId,
        $url: url
      }
    }).then((res) => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      console.log('rr', res.result);
      return res.result  
    })
    return res
  }
  
  return {
    fetch
  }
}
export default useFetchEffect