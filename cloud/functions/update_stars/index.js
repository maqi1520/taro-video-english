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
    userStars,
    wrongs,
  } = event
  if(questionId){
    const res=await db.collection('voscreen').doc(questionId).update({
      data:{
        stars
      }
    })

  }
  if(userId && userStars){
    return await db.collection('user_profile').doc(userId).update({
      data:{
        stars:userStars
      }
    }) 
  }
  if(userId && wrongs){
    return await db.collection('user_profile').doc(userId).update({
      data:{
        wrongs:wrongs
      }
    }) 
  }
  return userId
}