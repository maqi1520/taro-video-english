import Taro from "@tarojs/taro";
import { View, Text, Button, OpenData } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import "./index.scss";

import { useSelector } from "@tarojs/redux";
import { iRootState } from "../../store/createStore";
interface Props {}

const Me: Taro.FC<Props> = () => {
  const score = useSelector((state: iRootState) => state.score);
  return (
    <View className="page">
      <View className="userinfo">
        <View className="userinfo-left">
          <View className="avatar">
            <OpenData type="userAvatarUrl" />
          </View>
        </View>
        <View className="userinfo-right">
          <View>
            <View className="user-name">
              <OpenData type="userNickName" />
            </View>
            <Text>
              Score:<Text className="score">{score.points}</Text>
            </Text>
          </View>
        </View>
        <View className="userinfo-right">
          <Button
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/ranking/index"
              });
            }}
            size="mini"
            type="primary"
          >
            排行榜
          </Button>
        </View>
      </View>
      <AtList>
        <AtListItem
          title="My Stars"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/wrongs/index?type=stars"
            });
          }}
          arrow="right"
          iconInfo={{ size: 25, color: "#78A4FA", value: "star" }}
        />
        <AtListItem
          title="My Wrongs"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/wrongs/index?type=wrongs"
            });
          }}
          arrow="right"
          iconInfo={{ size: 25, color: "#FF4949", value: "bookmark" }}
        />
        <AtListItem
          title="Honeyed words"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/words/index"
            });
          }}
          arrow="right"
          iconInfo={{ size: 25, color: "#a482f4", value: "heart" }}
        />
        <AtListItem
          hasBorder={false}
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/message/index"
            });
          }}
          title="Leaving a message"
          arrow="right"
          iconInfo={{ size: 25, color: "#fcbd24", value: "message" }}
        />
      </AtList>
    </View>
  );
};

Me.config = {
  navigationBarTitleText: "Me"
};

export default Me;
