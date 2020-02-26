import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface IuserInfo {
  _id: string;
  nickName?: string;
  avatarUrl?: string;
  stars: string[];
  wrongs: string[];
}
export default createModel<IuserInfo>({
  state: {
    stars: [],
    wrongs: []
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
    },
    async updateWrongs({ questionId }, rootState): Promise<void> {
      const wrongs = [...rootState.userInfo.wrongs];
      const userId = rootState.userInfo._id;
      if (!wrongs.includes(questionId)) {
        wrongs.push(questionId);
        await Taro.cloud.callFunction({
          name: "update_stars",
          data: {
            userId,
            wrongs
          }
        });
        this.save({
          wrongs
        });
      }
    }
  })
});
