// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

const random = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const where = { status: _.neq(0) }
  const countResult = await db.collection('sweetNothings').where(where).count()
  const total = countResult.total
  const res =await db.collection('sweetNothings').where(where)
    .skip(random(0,total))
    .limit(1)
    .get()

  return {
    data:res.data,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}