const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async(event) => {
  const {
    message,
    parentId='0'
  } = event
  const wxContext = cloud.getWXContext()
  const res = await db.collection('message').add({
   data:{
     message,
     parentId,
     createAt:new Date(),
     openId: wxContext.OPENID
   }
  })
  return {
    res,
    success: 1
  }
}