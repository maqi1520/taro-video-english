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
    id,
    userId
  } = event

  const countResult = await db.collection('voscreen').count()
  const total = countResult.total
  let question;
  if (id) {
    const res = await db.collection('voscreen').doc(id).get()
    question = res.data
  } else {
    res = await db.collection('voscreen')
      .skip(random(0, total))
      .limit(1)
      .get()
    question = res.data[0]
  }
  let starCount = 0
  if (userId) {
    starCount = await db.collection('worngs').where({
      userId,
      questionId: question._id,
      type: 'stars'
    }).count()
  }

  return {
    question,
    hasStar: starCount > 0,
    success: 1
  }
}