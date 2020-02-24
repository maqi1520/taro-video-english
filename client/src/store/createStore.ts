import loadingPlugin from "@rematch/loading";
import models from "../models";
import { init, RematchRootState, RematchDispatch } from "@rematch/core";

export const store = init({
  models
});
export type Store = typeof store;
export type Dispatch = RematchDispatch<typeof models>;
export type iRootState = RematchRootState<typeof models>;

export default init({
  models,
  plugins: [loadingPlugin()]
});
