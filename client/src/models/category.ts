import { createModel } from "@rematch/core";

export default createModel({
  name: "category",
  state: {
    show: false,
    data: [],
    visible: false
  },
  reducers: {
    save: (state, payload) => ({
      ...state,
      ...payload
    })
  }
});
