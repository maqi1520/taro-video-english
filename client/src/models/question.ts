import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

export interface Ichoices {
  [propName: string]: string;
}
export interface Iquestion {
  _id: string;
  id: string;
  choices: {
    answer: string;
    distractor: string;
  };
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
  choices: string[];
  choose: string;
  countdown: number;
  question: Iquestion;
  hasStar: boolean;
  loading: boolean;
}

interface IquestionRes {
  errMsg: string;
  result: {
    hasStar: boolean;
    question: Iquestion;
  };
}

const randomChoices = () =>
  ["answer", "distractor"].sort(() => {
    return Math.random() > 0.5 ? -1 : 1;
  });

export default createModel({
  state: {
    choices: [],
    choose: "",
    countdown: 0,
    hasStar: false,
    loading: true,
    question: {} as Iquestion
  },
  reducers: {
    save: (state: Istate, payload: Istate) => ({
      ...state,
      ...payload
    })
  },
  effects: () => ({
    async get({ id }): Promise<void> {
      const res = await Taro.cloud.callFunction({
        name: "voscreen",
        data: {
          id
        }
      });
      const question = (res as IquestionRes).result.question;
      const hasStar = (res as IquestionRes).result.hasStar;
      this.save({
        choices: randomChoices(),
        choose: "",
        loading: false,
        question,
        hasStar,
        countdown: question.countdown
      });
    },
    async updateViews(payload): Promise<void> {
      const views = parseInt(payload.video.metadata.views) + 1;
      await Taro.cloud.callFunction({
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
    },
    async updateStars(payload): Promise<void> {
      const stars = parseInt(payload.stars) + 1;
      const question = {
        ...payload,
        stars
      };
      this.save({
        question
      });
      await Taro.cloud.callFunction({
        name: "update_voscreen",
        data: {
          _id: payload._id,
          stars
        }
      });
    }
  })
});
