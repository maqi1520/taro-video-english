import Taro, { useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";

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
      <View className="list">
        {data.map(item => (
          <View key={item._id}>{item.name}</View>
        ))}
      </View>
    </View>
  );
};

RankingList.config = {
  navigationBarTitleText: "Ranking-List"
};

export default RankingList;
