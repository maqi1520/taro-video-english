import { createModel } from "@rematch/core";

export default createModel({
  name: "category",
  state: {
    show: new Date().getTime() > new Date("2020-03-06 17:00").getTime(),
    data: [],
    visible: false
  },
  reducers: {}
});
