import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";
import { Iquestion } from "./question";

export interface Istate {
  data: Iquestion[];
  loading: boolean;
}

interface IRes {
  errMsg: string;
  result: {
    data: Iquestion[];
  };
}

export default createModel<Istate>({
  state: {
    loading: true,
    data: []
  },
  reducers: {
    save: (state: Istate, payload: Istate) => ({
      ...state,
      ...payload
    })
  },
  effects: () => ({
    async query({ type }, rootState): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "query_wrongs",
        data: {
          userId: rootState.userInfo._id,
          type
        }
      });
      const data = (res as IRes).result.data;
      this.save({
        loading: false,
        data
      });
    },
    async create({ userId, questionId, type }): Promise<void> {
      await Taro.cloud.callFunction({
        name: "create_wrongs",
        data: {
          userId,
          questionId,
          type
        }
      });
    },
    async remove({ questionId }, rootState): Promise<void> {
      const data = rootState.wrongs.data.filter(
        question => question._id !== questionId
      );
      this.save({
        data
      });

      await Taro.cloud.callFunction({
        name: "remove_wrongs",
        data: {
          _id: questionId
        }
      });
    }
  })
});
