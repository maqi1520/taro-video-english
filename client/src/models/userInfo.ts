import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface IuserInfo {
  _id: string;
  nickName?: string;
  avatarUrl?: string;
  stars: string[];
}
export default createModel<IuserInfo>({
  state: {
    stars: []
  },
  reducers: {
    save: (state: IuserInfo, payload: IuserInfo) => ({
      ...state,
      ...payload
    })
  },
  effects: dispatch => ({
    async get(userInfo): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "user_profile",
        data: {
          userInfo
        }
      });
      this.save(res.result);
    },
    async updateStar({ questionId, stars, userId, userStars }): Promise<void> {
      console.log(questionId, stars, userId, userStars);

      dispatch({ type: "question/updateStar", payload: stars });
      this.save({
        stars: userStars
      });
      await Taro.cloud.callFunction({
        name: "update_stars",
        data: {
          questionId,
          stars,
          userId,
          userStars
        }
      });
    }
  })
});
