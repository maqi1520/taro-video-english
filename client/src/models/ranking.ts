import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

interface Iuser {
  _id: string;
  nickName: string;
  avatarUrl: string;
  points: number;
  success: number;
  fail: number;
}

export type Iranking = {
  total: number;
  data: Iuser[];
};
export default createModel({
  state: {
    total: 0,
    data: []
  },
  reducers: {
    save: (state: Iranking, payload: Iranking) => ({
      ...state,
      ...payload
    })
  },
  effects: () => ({
    async query(): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "ranking_query",
        data: {}
      });
      this.save(res.result);
    }
  })
});
