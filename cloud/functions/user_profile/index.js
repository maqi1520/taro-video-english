const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  throwOnNotFound: false
})
exports.main = async (event) => {
  const {
    userInfo
  } = event
  const wxContext = cloud.getWXContext()
  const res = await db.collection('user_profile')
    .where({
      openId: wxContext.OPENID, // 填入当前用户 openid
    })
    .get()
  if(res.data.length > 0) {
    return res.data[0]
  }
  else {
    const data = {
      ...userInfo,
      openId: wxContext.OPENID,
      score: {
        fail: 0,
        success: 0,
        points: 0,
      }
    }
   const addRes= await db.collection('user_profile').add({
      data
    })
    return { ...data, _id: addRes._id}
  }
}