// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const res = await db.collection('sweetNothings').add({
    data: {
      ...event,
      openId: wxContext.OPENID
    }
  })
  return {
    res,
    success: 1
  }
}