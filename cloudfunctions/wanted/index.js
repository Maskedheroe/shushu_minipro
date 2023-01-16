// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  
  const app = new TcbRouter({
    event
  })
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const collection = db.collection('wanted')

  app.router('booklist', async (ctx, _) => {
    const {
      classify
    } = event
    ctx.body = await collection.where({
        classify
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })
  app.router('add', (ctx, _) => {
    const openid = wxContext.OPENID

    const {
      bookinfo
    } = event
    collection.add({
      data: {
        ...bookinfo,
        createTime: db.serverDate(),
        openid
      }
    }).then(res => {
      ctx.body = {
        code: 200,
        data: res
      }
    }).catch(console.error)
  })
  return app.serve()
}