// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    _id
  } = event
  const res = await db.collection('wrongs').doc(_id).remove()
  return {
    res,
    success: 1
  }
}