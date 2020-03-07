import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface IuserInfo {
  show: boolean;
  _id: string;
  nickName?: string;
  avatarUrl?: string;
}
export default createModel<IuserInfo>({
  state: {},
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
      dispatch({
        type: "category/save",
        payload: { show: (res.result as IuserInfo).show }
      });
    }
  })
});
