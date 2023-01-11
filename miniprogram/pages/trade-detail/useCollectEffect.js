const useCollectEffect = () => {
  const checkoutCollect = async (tradeId) => {
    const res = await wx.cloud.callFunction({
      name: 'collection',
      data: {
        $url: 'collections'
      }
    })
    let resCollection = []
    if (res?.result.code === 200) {
      resCollection = [...res?.result.data]
    }
    // 如果查不到就是undefined
    const isCollected = resCollection[0].collections.find((collection) => {
      return collection === tradeId
    })
    return !!isCollected
  }
  const handleCollectEvent = async (isCollected, tradeId) => {
    // 请求后端添加或者删除收藏
    const res = await wx.cloud.callFunction({
      name: 'collection',
      data: {
        $url: 'update-collect',
        tradeId
      }
    })
    return !isCollected
  }
  return {
    checkoutCollect,
    handleCollectEvent
  }
}

export default useCollectEffect