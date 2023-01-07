// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const TcbRouter = require('tcb-router')

const db = cloud.database()

const tradeCollection =
  db.collection('trade-infomation')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    const keywords = event.keywords || ''
    let w = {}
    if (keywords.trim() !== '') {
      w = {
        content: db.RegExp({
          regexp: keywords,
          options: 'i'
        })
      }
    }
    const tradeList = await tradeCollection.where(w).skip(event.start)
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
  app.router('detail', async (ctx, next) => {
    const tradeId = event.tradeId
    // 详情查询
    let detail = {}
    detail = await tradeCollection.where({
      _id: tradeId
    }).get().then(res => res.data)
    // 评论查询 然后倒序排序
    const countResult = await tradeCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection('trade-comment').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
          tradeId
        }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
        if (tasks.length > 0) {
          commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
            return {
              data: acc.data.concat(cur.data)
            }
          })
        }
      }
    }
    ctx.body = {
      commentList,
      detail
    }
  })

  return app.serve()
}