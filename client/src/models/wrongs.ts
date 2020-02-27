import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";
import { Iquestion } from "./question";

export interface Istate {
  data: Iquestion[];
}

interface IRes {
  errMsg: string;
  result: {
    data: Iquestion[];
  };
}

export default createModel<Istate>({
  state: {
    data: []
  },
  reducers: {
    save: (state: Istate, payload: Istate) => ({
      ...state,
      ...payload
    }),
    remove: (state: Istate, { questionId }) => {
      console.log(questionId);

      const data = state.data.filter(question => question._id !== questionId);
      return {
        ...state,
        data
      };
    }
  },
  effects: () => ({
    async query({ stars, wrongs }): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "voscreen",
        data: {
          stars,
          wrongs
        }
      });
      const data = (res as IRes).result.data;
      console.log(data);

      this.save({
        data
      });
    }
  })
});
