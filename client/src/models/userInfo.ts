import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface IuserInfo {
  _id: string;
  nickName?: string;
  avatarUrl?: string;
}
export default createModel({
  state: null,
  reducers: {
    save: (state: IuserInfo, payload: IuserInfo) => ({
      ...state,
      ...payload
    })
  },
  effects: () => ({
    async get(userInfo): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "user_profile",
        data: {
          userInfo
        }
      });
      this.save(res.result);
    }
  })
});
