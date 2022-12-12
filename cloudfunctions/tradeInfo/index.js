// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const TcbRouter = require('tcb-router')

const db = cloud.database()

const tradeCollection =
  db.collection('trade-infomation')


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    const tradeList = await tradeCollection.skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
    ctx.body = {
      code: 200,
      data: tradeList
    }
  })

  return app.serve()
}