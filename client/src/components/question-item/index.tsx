import Taro, { useCallback } from "@tarojs/taro";
import { View, Text, Video } from "@tarojs/components";
import { Iquestion } from "../../models/question";
import { useDispatch } from "@tarojs/redux";
import { Dispatch } from "../../store/createStore";
import "./index.scss";

interface Props {
  show: boolean;
  question: Iquestion;
  type: string;
}

const QuestionItem: Taro.FC<Props> = ({ question, type, show }) => {
  const dispatch = useDispatch<Dispatch>();
  const onRemove = useCallback(
    questionId => {
      dispatch({
        type: "wrongs/remove",
        payload: {
          questionId,
          type
        }
      });
    },
    [dispatch]
  );
  return (
    <View className="question-container">
      {show ? (
        <View className="video-container">
          <Video
            src={"http://image.maqib.cn" + question.video.sources.mp4}
            autoplay={false}
            style={{ width: "100%", height: "56.25vw" }}
            showCenterPlayBtn
          />
        </View>
      ) : null}

      <View className="video-desc clearfix">
        <View className="video-name">
          <View>{question.video.metadata.name}</View>
        </View>
        <View className="video-answer">
          <View>{question.video.subtitle}</View>
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
