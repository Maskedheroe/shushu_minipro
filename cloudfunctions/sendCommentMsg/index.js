// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const res = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `/pages/trade-detail/trade-detail?tradeId=${event.tradeId}`,
    data: {
      keyword1: {
        value: '评价完成'
      },
      keyword2: {
        value: event.content
      }
    },
    templateId: 'xIMaeaWEEPYPkKsF9eWXAbXg1fuo-CEKjP2E95XK2K0',
    formId: event.formId
  })
  return res
}