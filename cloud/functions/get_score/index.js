const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  throwOnNotFound: false
})
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const res = await db.collection('score')
    .where({
      openId: wxContext.OPENID, // 填入当前用户 openid
    })
    .get()
  if (res.data.length > 0) {
    return res.data[0]
  }else{
    return {
      openId: wxContext.OPENID,
      points:0,
      success:0,
      fail:0
    }
  }
}