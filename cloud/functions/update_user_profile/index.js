const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  throwOnNotFound: false
})
exports.main = async(event) => {
  const {
    _id,
    score
  } = event
  try {
    return await db.collection('user_profile').doc(_id).update({
      data: {
        score
      }
    })
  } catch (e) {
    console.error(e);
  }
}