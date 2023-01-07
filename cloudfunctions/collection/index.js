// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const TcbRouter = require('tcb-router')

const db = cloud.database()

const userCollections =
  db.collection('user-collections')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 查询收藏集合
  app.router('collections', async (ctx, next) => {
    const openid = wxContext.OPENID
    // 所有收藏查询
    const collections = await userCollections.where({
      user_openid: openid
    }).get().then(res => {
      return res.data
    })
    // 评论查询 然后倒序排序

    ctx.body = {
      code: 200,
      data: collections
    }
  })
  // 更新收藏状态
  app.router('update-collect', async (ctx, next) => {
    const command = db.command
    const openid = wxContext.OPENID
    const tradeId = event.tradeId

    const result = await userCollections.where({
      user_openid: openid
    }).get().then(res => {
      return res.data
    })
    const findCollections = result[0].collections
    let updateCollections = []
    if (findCollections.map(mtradeId => {
      return mtradeId === tradeId
    }).length > 0) {
      // 原本已经收藏了 就进行删除收藏
      updateCollections = findCollections.filter(mtradeId => mtradeId !== tradeId)
    } else {
      updateCollections = [...findCollections, tradeId]
    }

    const res = await userCollections.where({
        user_openid: openid
      }).update({
        data: {
          collections: command.set(updateCollections)
        },
        success: function (res) {
          return res.data
        }
      })
    
    ctx.body = {
      code: 200,
      data: res
    }
  })
  return app.serve()
}