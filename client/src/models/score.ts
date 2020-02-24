import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export type IScore = {
  points: number;
  success: number;
  fail: number;
};
export default createModel({
  state: {
    points: 0,
    success: 0,
    fail: 0
  },
  reducers: {
    save: (state: IScore, payload: IScore) => ({
      ...state,
      ...payload
    })
  },
  effects: () => ({
    async get(): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "get_score",
        data: {}
      });
      this.save(res.result);
    },
    async update(score): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "update_score",
        data: {
          score
        }
      });
      this.save({
        _id: res.result._id,
        ...score
      });
    }
  })
});
