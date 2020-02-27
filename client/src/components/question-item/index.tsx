import Taro, { useState, useCallback } from "@tarojs/taro";
import { View, Text, Video } from "@tarojs/components";
import { Iquestion } from "../../models/question";
import { useDispatch } from "@tarojs/redux";
import { Dispatch } from "../../store/createStore";
import "./index.scss";

interface Props {
  question: Iquestion;
  type: string;
}

const QuestionItem: Taro.FC<Props> = ({ question, type }) => {
  const [playing, setPlaying] = useState(false);
  const dispatch = useDispatch<Dispatch>();
  const onRemove = useCallback(
    questionId => {
      dispatch({
        type: "wrongs/remove",
        payload: {
          questionId
        }
      });

      if (type === "stars") {
        dispatch({
          type: "userInfo/updateUserStars",
          payload: {
            questionId
          }
        });
      } else {
        dispatch({
          type: "userInfo/updateWrongs",
          payload: {
            questionId
          }
        });
      }
    },
    [dispatch]
  );
  return (
    <View className="question-container">
      <View className="video-container">
        <Video
          src={"http://image.maqib.cn" + question.video.sources.mp4}
          autoplay={false}
          style={{ width: "100%", height: "56.25vw" }}
          showCenterPlayBtn
          showPlayBtn={false}
          onPlay={() => setPlaying(true)}
          onEnded={() => setPlaying(false)}
        />
        {playing ? (
          <View className="sub-title">
            <View>{question.video.subtitle}</View>
          </View>
        ) : null}
      </View>

      <View className="video-desc clearfix">
        <View className="video-name">
          <View>{question.video.metadata.name}</View>
        </View>
        <View className="video-answer">
          <View>{question.choices.answer}</View>
        </View>
        <View
          onClick={() => onRemove(question._id)}
          className="pull-right weui-swiped-btn weui-swiped-btn_warn"
        >
          <Text>remove</Text>
        </View>
      </View>
    </View>
  );
};

export default QuestionItem;
