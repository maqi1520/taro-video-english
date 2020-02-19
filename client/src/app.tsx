import Taro, { Component, Config } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import store from "./store/createStore";
import Index from "./pages/index";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
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
    pages: ["pages/index/index", "pages/find/index", "pages/my/index"],
    cloud: true,
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      backgroundColor: "#ffffff",
      color: "#b3b3b3",
      selectedColor: "#0c17d8",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./assets/images/home.png",
          selectedIconPath: "./assets/images/home-selected.png"
        },
        {
          pagePath: "pages/find/index",
          text: "搜索",
          iconPath: "./assets/images/search.png",
          selectedIconPath: "./assets/images/search-selected.png"
        },
        {
          pagePath: "pages/my/index",
          text: "我的",
          iconPath: "./assets/images/user.png",
          selectedIconPath: "./assets/images/user-selected.png"
        }
      ]
    }
  };

  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
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
