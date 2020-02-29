import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

export default function Loading({ show, children }) {
  return show ? (
    <View className="page">
      <View className="logo-doodle-notifier">
        <View className="outer ball0">
          <View className="inner"></View>
        </View>
        <View className="outer ball1">
          <View className="inner"></View>
        </View>
        <View className="outer ball2">
          <View className="inner"></View>
        </View>
        <View className="outer ball3">
          <View className="inner"></View>
        </View>
      </View>
    </View>
  ) : (
    <View>{children}</View>
  );
}
