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
  if (res.data.length > 0) {
    if (userInfo && !res.data[0].nickName) {
      await db.collection('user_profile').doc(res.data[0]._id).update({
        data: userInfo
      })
      return {
        ...userInfo,
        _id: res.data[0]._id,
        openId: wxContext.OPENID,
      }
    }
    return res.data[0]
  } else {
    let data = {}
    if (!userInfo) {
      data = {
        openId: wxContext.OPENID,
      }
    } else {
      data = {
        ...userInfo,
        openId: wxContext.OPENID
      }
    }
    const addRes = await db.collection('user_profile').add({
      data
    })
    return {
      ...data,
      _id: addRes._id
    }
  }
}