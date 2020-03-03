import { createModel } from "@rematch/core";

export default createModel({
  name: "category",
  state: {
    show: new Date().getTime() > new Date("2020-03-03 12:00").getTime(),
    data: [],
    visible: false
  },
  reducers: {}
});
