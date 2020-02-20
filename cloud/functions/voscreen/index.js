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
  const {
    product_name,
    group_name,
    current_question_id,
    video_id,
    language_code
  } = event
  const countResult = await db.collection('voscreen').count()
  const total = countResult.total
  const res = await db.collection('voscreen')
    .skip(random(0, total))
    .limit(1)
    .get()

  return {
    question: res.data[0],
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}