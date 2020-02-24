const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  throwOnNotFound: false
})
exports.main = async(event) => {
  const {
    score
  } = event
  try {
    if(score._id){
     const {_id,...data}=score
      await db.collection('score').doc(score._id).update({
        data
      })
      return {
        _id
      }
    }else{
      return await db.collection('score').add({
        data: score
      })
    }  
  } catch (e) {
    console.error(e);
  }
}