const useCompleteEffect = () => {
  const handleCompleteEffect = async (tradeId, getCurrentPages) => {
    const res = await wx.cloud.callFunction({
      name: 'tradeInfo',
      data: {
        $url: 'complete',
        tradeId,
        complete: true
      }
    })
    wx.navigateBack()
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.onPullDownRefresh()
  }
  return {
    handleCompleteEffect
  }
}
export default useCompleteEffect