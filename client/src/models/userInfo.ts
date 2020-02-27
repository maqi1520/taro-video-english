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
      let wrongs = [...rootState.userInfo.wrongs];
      const userId = rootState.userInfo._id;
      if (!wrongs.includes(questionId)) {
        wrongs.push(questionId);
      } else {
        wrongs = wrongs.filter(id => id !== questionId);
      }
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
    },
    async updateUserStars({ questionId }, rootState): Promise<void> {
      let stars = [...rootState.userInfo.stars];
      const userId = rootState.userInfo._id;
      if (!stars.includes(questionId)) {
        stars.push(questionId);
      } else {
        stars = stars.filter(id => id !== questionId);
      }
      await Taro.cloud.callFunction({
        name: "update_stars",
        data: {
          userId,
          userStars: stars
        }
      });
      this.save({
        stars
      });
    }
  })
});
