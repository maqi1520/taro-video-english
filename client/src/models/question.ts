import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface Ichoices {
  [propName: string]: string;
}
export interface Iquestion {
  _id: string;
  id: string;
  choices: Ichoices[];
  countdown: number;
  stars: number;
  video: {
    subtitle: string;
    file: string;
    metadata: {
      name: string;
      views: number;
    };
    sources: {
      mp4: string;
    };
  };
}

export interface Istate {
  countdown: number;
  question: Iquestion;
}

interface IquestionRes {
  errMsg: string;
  result: {
    question: Iquestion;
  };
}

export default createModel({
  state: {
    countdown: 0,
    question: {} as Iquestion
  },
  reducers: {
    save: (state: Istate, payload: Istate) => ({
      ...state,
      ...payload
    }),
    updateStar: (state: Istate, stars) => ({
      ...state,
      question: {
        ...state.question,
        stars
      }
    })
  },
  effects: () => ({
    async get(): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "voscreen",
        data: {}
      });
      const question = (res as IquestionRes).result.question;
      this.save({
        question,
        countdown: question.countdown
      });
    },
    async updateViews(payload): Promise<void> {
      const views = parseInt(payload.video.metadata.views) + 1;
      const res = await Taro.cloud.callFunction({
        name: "update_voscreen",
        data: {
          _id: payload._id,
          views
        }
      });

      const question = {
        ...payload,
        video: {
          ...payload.video,
          metadata: {
            ...payload.video.metadata,
            views
          }
        }
      };
      this.save({
        question
      });
    }
  })
});
