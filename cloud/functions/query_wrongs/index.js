// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const{userId,type}=event
  const res=await db.collection('wrongs').aggregate()
    .match({
      userId,
      type
    })
    .lookup({
      from: 'voscreen',
      localField: 'questionId',
      foreignField: '_id',
      as: 'question'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$question', 0]), '$$ROOT']),
    })
    .project({
      question: 0
    })
    .end()
    return {
      data:res.list,
      success: 1
    }
}