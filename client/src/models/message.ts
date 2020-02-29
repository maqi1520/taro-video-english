import { createModel } from "@rematch/core";
import Taro from "@tarojs/taro";

interface IItem {
  _id: string;
  message: string;
  nickName: string;
  avatarUrl: string;
  createAt: string;
}
export interface Istate {
  pageSize: number;
  pageNum: number;
  total: number;
  data: IItem[];
  loading: boolean;
}
interface IRes {
  errMsg: string;
  result: {
    data: IItem[];
    total: number;
  };
}

export default createModel<Istate>({
  state: {
    pageSize: 10,
    pageNum: 1,
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
    async query(_payload, rootState): Promise<void> {
      const { data, pageNum, pageSize } = rootState.message;
      console.log(data);

      const res = await Taro.cloud.callFunction({
        name: "message",
        data: {
          pageNum,
          pageSize,
          parentId: "0"
        }
      });
      this.save({
        loading: false,
        data: [...data, ...(res as IRes).result.data],
        total: (res as IRes).result.total
      });
    },
    async create({ message }): Promise<void> {
      Taro.cloud
        .callFunction({
          name: "createMessage",
          data: {
            message
          }
        })
        .then(res => {
          if (res && res.result) {
            this.save({
              data: [],
              total: 0,
              pageNum: 1
            });
            this.query();
          }
        });
    }
  })
});
