import Taro, { useEffect, useRouter } from "@tarojs/taro";
import { View, Text, Video, Button } from "@tarojs/components";
import { AtIcon } from "taro-ui";
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
        title: "My  stars"
      });
      dispatch({
        type: "wrongs/query",
        payload: {
          stars: userInfo.stars
        }
      });
    } else {
      Taro.setNavigationBarTitle({
        title: "My  wrongs"
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
  }, [dispatch, userInfo, router.params]);

  return (
    <View className="page">
      {data.map(question => (
        <View key={question._id} className="container">
          <Video
            src={"http://image.maqib.cn" + question.video.sources.mp4}
            autoplay={false}
            controls
            style={{ width: "100%", height: "56.25vw" }}
            id="video"
          />
          <View className="video-desc clearfix">
            <View className="video-name">
              <View>{question.video.metadata.name}</View>
            </View>
            <View className="video-icon">
              <AtIcon size="20" value="eye"></AtIcon>
              <Text>{question.video.metadata.views}</Text>
            </View>
            <Button
              className="pull-right"
              data-name={question.video.metadata.name}
              data-id={question._id}
              type="primary"
              size="mini"
              openType="share"
            >
              <AtIcon value="share-2" size="12" color="#fff"></AtIcon>
              <Text> share</Text>
            </Button>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Wrongs;
