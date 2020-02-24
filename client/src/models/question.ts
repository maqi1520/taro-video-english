import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface Ichoices {
  [propName: string]: string;
}
export interface Iquestion {
  id: string;
  choices: Ichoices[];
  countdown: number;
  video: {
    subtitle: string;
    file: string;
    sources: {
      mp4: string;
    };
  };
}

export default createModel({
  state: null,
  reducers: {
    save: (state: Iquestion, payload: Iquestion) => ({
      ...state,
      ...payload
    })
  },
  effects: () => ({
    async get(): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "voscreen",
        data: {}
      });
      this.save(res.result.question);
    }
  })
});
