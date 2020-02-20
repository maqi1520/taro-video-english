import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import { View, Text, Video, Button, Switch } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import cl from "classnames";
import "./index.scss";

interface Props {}

interface Ichoices {
  [propName: string]: string;
}
interface Iquestion {
  id: string;
  choices: Ichoices[];
  video: {
    subtitle: string;
    file: string;
    sources: {
      mp4: string;
    };
  };
}
interface IuserInfo {
  nickName?: string;
  avatarUrl?: string;
}

const getQuestion = (): Promise<any> => {
  return Taro.cloud.callFunction({
    name: "voscreen",
    data: {
      product_name: "voStructure",
      group_name: "can",
      current_question_id: 1797,
      video_id: "jfd518pvu2z758pa2",
      language_code: "zh"
    }
  });
};

const My: Taro.FC<Props> = () => {
  const [question, setQuestion] = useState<Iquestion | undefined>();
  const [nextQuestion, setNextQuestion] = useState<Iquestion | undefined>();
  const [userInfo, setUserInfo] = useState<IuserInfo>({});
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [choose, setChoose] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  useEffect(() => {
    Taro.showLoading({
      title: "loading"
    });
    Taro.getUserInfo({
      success: res => {
        setUserInfo(res.userInfo);
      }
    });
    getQuestion().then(res => {
      if (res && res.result) {
        setQuestion(res.result.question);
        setLoading(false);
      }
    });
    getQuestion().then(res => {
      if (res && res.result) {
        setNextQuestion(res.result.question);
        Taro.hideLoading();
      }
    });
  }, []);

  const load = useCallback(() => {
    setShow(false);
    setStep(0);
    setChoose("");
    setQuestion(nextQuestion);
    getQuestion().then(res => {
      if (res && res.result) {
        setNextQuestion(res.result.question);
      }
    });
  }, [nextQuestion]);
  const onEnded = useCallback(() => {
    if (step === 0) {
      setStep(1);
    }
  }, []);
  const handleChange = useCallback(e => {
    setShow(e.target.value);
  }, []);
  const handleChoose = useCallback(value => {
    setChoose(value);
    setStep(2);
  }, []);
  if (loading || !question || !nextQuestion) {
    return null;
  }
  return (
    <View className="page">
      <View className="userinfo">
        <View className="userinfo-left">
          <AtAvatar
            size="large"
            text={userInfo.nickName}
            image={userInfo.avatarUrl}
          ></AtAvatar>
        </View>
        <View className="userinfo-right">
          <Text>{userInfo.nickName}</Text>
          <View>
            Score:<Text>{100}</Text>
          </View>
        </View>
      </View>
      <View className="container">
        <Video
          src={question.video.sources.mp4}
          controls={true}
          autoplay={true}
          style={{ width: "100%", height: "56.25vw" }}
          initialTime={0}
          id="video"
          onEnded={onEnded}
          loop={false}
          muted={false}
        />
        <Video
          src={nextQuestion.video.sources.mp4}
          autoplay={false}
          style={{ display: "none" }}
        />
      </View>

      <View className="choose">
        {step >= 1 ? (
          <View>
            <View className="clearfix ">
              <View className="pull-left switch-label">Subtitle</View>
              <Switch
                className="pull-right"
                checked={show}
                onChange={handleChange}
              />
            </View>
            {show ? (
              <View className="subtitle">{question.video.subtitle}</View>
            ) : null}
            {Object.keys(question.choices).map(key => (
              <View
                onClick={() => handleChoose(key)}
                className={cl("choice", {
                  "choice-green":
                    choose && choose === "answer" && key === "answer",
                  "choice-red":
                    choose && choose !== "answer" && key !== "answer"
                })}
              >
                {question.choices[key]}
              </View>
            ))}
          </View>
        ) : null}
        {step === 2 ? (
          <Button type="primary" onClick={() => load()} className="mt">
            Next
          </Button>
        ) : null}
      </View>
    </View>
  );
};

My.config = {
  navigationBarTitleText: "listen"
};

export default My;
