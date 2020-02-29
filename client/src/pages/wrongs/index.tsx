import Taro, { useEffect, useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import QuestionItem from "../../components/question-item";
import "./index.scss";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";
import Loading from "../../components/loading/index";

interface Props {}

const Wrongs: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const { data, loading } = useSelector((state: iRootState) => state.wrongs);

  const router = useRouter();
  useEffect(() => {
    if (router.params.type === "stars") {
      Taro.setNavigationBarTitle({
        title: "My Stars"
      });
      dispatch({
        type: "wrongs/query",
        payload: {
          type: "stars"
        }
      });
    } else {
      Taro.setNavigationBarTitle({
        title: "My Wrongs"
      });
      dispatch({
        type: "wrongs/query",
        payload: {
          type: "wrongs"
        }
      });
    }
    return () => {
      Taro.setNavigationBarTitle({
        title: ""
      });
      dispatch({
        type: "wrongs/save",
        payload: {
          loading: true,
          data: []
        }
      });
    };
  }, [dispatch, router.params]);

  return (
    <View className="page">
      <Loading show={loading}>
        {!loading && data.length === 0 ? (
          <View className="empty-container">
            <View className="empty-pic">
              <View className="empty-text">No Data</View>
            </View>
          </View>
        ) : (
          <View>
            {data.map(question => (
              <QuestionItem
                type={router.params.type}
                key={question._id}
                question={question}
              />
            ))}
          </View>
        )}
      </Loading>
    </View>
  );
};

export default Wrongs;
