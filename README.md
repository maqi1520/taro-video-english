# "听读说"小程序

![二维码](./qrcode.jpg)

基于 [Taro](https://github.com/NervJS/taro) 开发的英语视频学习小程序。

## 本地运行

```bash
# 安装依赖，或 npm i
yarn

# 运行小程序，编译后的文件位于项目下的 dist 文件夹
# （微信 dev:weapp，支付宝 dev:alipay）
npm run dev:weapp

# 运行 H5
npm run dev:h5

# 运行 React Native，请务必查阅文档：https://nervjs.github.io/taro/docs/react-native.html
npm run dev:rn
```

## 项目说明

数据管理使用 [rematch](https://github.com/rematch/rematch)

后端使用[小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

部署修改 project.config.json 中的 appid 为自己的小程序 appid
