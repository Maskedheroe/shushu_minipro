const useDeleteEffect = () => {
  const handleDeleteEffect = async (tradeId, getCurrentPages) => {
    const res = await wx.cloud.callFunction({
      name: 'tradeInfo',
      data: {
        $url: 'delete',
        tradeId
      }
    })
    wx.navigateBack()
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.onPullDownRefresh()
  }
  return {
    handleDeleteEffect
  }
}
export default useDeleteEffect