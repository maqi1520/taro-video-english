const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async (event) => {
  const {
    parentId = 0
  } = event
  const wxContext = cloud.getWXContext()
  const res = await db.collection('tree')
    .where({
      parentId,
      openId: wxContext.OPENID, // 填入当前用户 openid
    })
    .limit(20) // 限制返回数量为 10 条
    .get()
  return {
    data: res.data,
    userInfo: wxContext
  }
}