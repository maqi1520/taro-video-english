const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async(event) => {
  const {
    name,
    parentId='0'
  } = event
  const wxContext = cloud.getWXContext()
  console.log(name)
  const res = await db.collection('tree').add({
   data:{
     name,
     parentId,
     openId: wxContext.OPENID
   }
  })
  return {
    res,
    success: 1
  }
}