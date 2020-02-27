import Taro, { Component, Config } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import store from "./store/createStore";
import Index from "./pages/listen/index";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools;
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/listen/index",
      "pages/message/index",
      "pages/words/index",
      "pages/me/index",
      "pages/ranking/index",
      "pages/wrongs/index"
    ],
    cloud: true,
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      backgroundColor: "#ffffff",
      color: "#333",
      selectedColor: "#39ac69",
      list: [
        {
          pagePath: "pages/listen/index",
          text: "listen",
          iconPath: "./assets/images/listen.png",
          selectedIconPath: "./assets/images/listen-s.png"
        },
        {
          pagePath: "pages/me/index",
          text: "Me",
          iconPath: "./assets/images/me.png",
          selectedIconPath: "./assets/images/me-s.png"
        }
      ]
    }
  };

  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
      const { dispatch } = store;
      dispatch({ type: "score/get" });
      // 获取用户信息
      Taro.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            Taro.getUserInfo({
              success: res => {
                dispatch({ type: "userInfo/get", payload: res.userInfo });
              }
            });
          } else {
            dispatch({ type: "userInfo/get" });
          }
        }
      });
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
