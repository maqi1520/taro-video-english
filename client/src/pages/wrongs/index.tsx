import Taro, { useEffect, useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import QuestionItem from "../../components/question-item";
import "./index.scss";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";

interface Props {}

const Wrongs: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const userInfo = useSelector((state: iRootState) => state.userInfo);
  const data = useSelector((state: iRootState) => state.wrongs.data);
  const router = useRouter();
  useEffect(() => {
    if (router.params.type === "stars") {
      Taro.setNavigationBarTitle({
        title: "My Stars"
      });
      dispatch({
        type: "wrongs/query",
        payload: {
          stars: userInfo.stars
        }
      });
    } else {
      Taro.setNavigationBarTitle({
        title: "My Wrongs"
      });
      dispatch({
        type: "wrongs/query",
        payload: {
          wrongs: userInfo.wrongs
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
          data: []
        }
      });
    };
  }, [dispatch, router.params]);

  return (
    <View className="page">
      {data.map(question => (
        <QuestionItem
          type={router.params.type}
          key={question._id}
          question={question}
        />
      ))}
    </View>
  );
};

export default Wrongs;
