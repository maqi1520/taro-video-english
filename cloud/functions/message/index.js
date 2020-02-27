// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { pageSize = 10, pageNum = 1 } = event;
  const wxContext = cloud.getWXContext();

  // 先取出集合记录总数
  const countResult = await db.collection('message').count();
  const total = countResult.total;

  const res = await db
    .collection('message')
    .skip((pageNum - 1) * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
    .limit(pageSize)
    .get();

  const data = await Promise.all(
    res.data.map(async item => {
      const { data: users } = await db
        .collection('user_profile')
        .where({
          openId: item.openId
        })
        .get();
      if (users.length > 0) {
        return {
          ...users[0],
          ...item
        };
      } else {
        return item;
      }
    })
  );
  return {
    data,
    total
  };
}