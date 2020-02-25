// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    questionId,
    stars,
    userId,
    userStars
  } = event
  const res=await db.collection('voscreen').doc(questionId).update({
    data:{
      stars
    }
  })
  return await db.collection('user_profile').doc(userId).update({
    data:{
      stars:userStars
    }
  }) 
}