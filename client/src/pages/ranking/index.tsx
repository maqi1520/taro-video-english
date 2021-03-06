import Taro, { useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";
import Loading from "../../components/loading/index";
import "./index.scss";

interface Props {}
const RankingList: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const { data, loading } = useSelector((state: iRootState) => state.ranking);
  useEffect(() => {
    dispatch({
      type: "ranking/query"
    });
  }, [dispatch]);

  return (
    <Loading show={loading}>
      <View className="page">
        <View className="user-list">
          <View className="user-item">
            <View className="user-td">
              <Text>NO</Text>
            </View>
            <View className="user-td">
              <Text>avatar</Text>
            </View>
            <View className="user-td">
              <Text>nickName</Text>
            </View>
            <View className="user-td">
              <Text>Score</Text>
            </View>
          </View>
          {data.map((item, i) => (
            <View className="user-item" key={item._id}>
              <View className="user-td">
                <Text>{i + 1}</Text>
              </View>
              <View className="user-td">
                <Image className="user-avatar" src={item.avatarUrl} />
              </View>
              <View className="user-td">
                <Text>{item.nickName}</Text>
              </View>
              <View className="user-td">
                <Text>{item.points}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Loading>
  );
};

RankingList.config = {
  navigationBarTitleText: "Top 10"
};

export default RankingList;
