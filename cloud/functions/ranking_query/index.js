// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    pageSize = 10, pageNum = 1
  } = event;
  const wxContext = cloud.getWXContext();

  // 先取出集合记录总数
  const countResult = await db.collection('score').count();
  const total = countResult.total;
  var $ = db.command.aggregate

  const res =await db.collection('score').aggregate()
    .lookup({
      from: 'user_profile',
      localField: 'openId',
      foreignField: 'openId',
      as: 'userinfo'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$userinfo', 0]), '$$ROOT']),
    })
    .project({
      userinfo: 0,
    })
    .sort({
      points: -1
    })
    .skip((pageNum - 1) * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
    .limit(pageSize)
    .end()
  return {
    data: res.list,
    total
  };
};