// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database() // 连接数据库
const rp = require('request-promise')
const booklistCollection = db.collection('booklist')
const Max_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const {data} = await getAllBookfromCollection()
  return data
}

const getAllBookfromCollection = async () => {
  const countResult = await booklistCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / Max_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = booklistCollection.skip(i * Max_LIMIT).limit(Max_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if(tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  return list
}