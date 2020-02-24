import Taro, { useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";
import "./index.scss";

interface Props {}
const RankingList: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const ranking = useSelector((state: iRootState) => state.ranking);
  const { data, total } = ranking;
  useEffect(() => {
    dispatch({
      type: "ranking/query"
    });
  }, [dispatch]);

  return (
    <View className="page">
      <View className="user-list">
        <View className="user-item" key={item._id}>
          <View className="user-td">NO</View>
          <View className="user-td">avatar</View>
          <View className="user-td">nickName</View>
          <View className="user-td">score</View>
          <View className="user-td">success</View>
        </View>
        {data.map((item, i) => (
          <View className="user-item" key={item._id}>
            <View className="user-td">{i + 1}</View>
            <View className="user-td">
              <Image className="user-avatar" src={item.avatarUrl} />
            </View>
            <View className="user-td">{item.nickName}</View>
            <View className="user-td">{item.points}</View>
            <View className="user-td">{item.success}</View>
          </View>
        ))}
      </View>
    </View>
  );
};

RankingList.config = {
  navigationBarTitleText: "Ranking-List"
};

export default RankingList;
