// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    _id,
    views,
    stars
  } = event
  if(stars){
    return await db.collection('voscreen').doc(_id).update({
      data:{
        stars
      }
    })
  }

  return await db.collection('voscreen').doc(_id).update({
    data:{
      video:{
        metadata:{
          views
        }
      }
    }
  })
}