import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import {
  View,
  Text,
  Video,
  Button,
  Switch,
  OpenData
} from "@tarojs/components";
import cl from "classnames";
import "./index.scss";

interface Props {}

interface Ichoices {
  [propName: string]: string;
}
interface Iquestion {
  id: string;
  choices: Ichoices[];
  countdown: number;
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
  const [userInfo, setUserInfo] = useState<IuserInfo>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [choose, setChoose] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  useEffect(() => {
    Taro.showLoading({
      title: "loading"
    });

    // 获取用户信息
    Taro.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          Taro.getUserInfo({
            success: res => {
              console.log(res.userInfo);
              setUserInfo(res.userInfo);
            }
          });
        }
      }
    });
    getQuestion().then(res => {
      if (res && res.result) {
        setQuestion(res.result.question);
        setLoading(false);
        Taro.hideLoading();
      }
    });
  }, []);

  const load = useCallback(() => {
    setShow(false);
    setStep(0);
    setChoose("");
    getQuestion().then(res => {
      if (res && res.result) {
        setQuestion(res.result.question);
      }
    });
  }, []);
  const onGetUserInfo = useCallback(e => {
    console.log(e.detail.userInfo);
    setUserInfo(e.detail.userInfo);
  }, []);
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
  if (loading || !question) {
    return null;
  }
  return (
    <View className="page">
      <View className="userinfo">
        <View className="userinfo-left">
          <View className="avatar">
            <OpenData type="userAvatarUrl" />
          </View>
        </View>
        <View className="userinfo-right">
          {!userInfo ? (
            <Button
              type="primary"
              size="mini"
              onGetUserInfo={onGetUserInfo}
              openType="getUserInfo"
            >
              授权登录
            </Button>
          ) : (
            <View>
              <View className="user-name">
                <OpenData type="userNickName" />
              </View>
              Score:<Text className="score">{100}</Text>
            </View>
          )}
        </View>
      </View>
      <View className="container">
        <View className="time-container">{question.countdown}</View>
        <Video
          src={"http://image.maqib.cn" + question.video.sources.mp4}
          autoplay
          controls
          style={{ width: "100%", height: "56.25vw" }}
          id="video"
          onEnded={onEnded}
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
                key={key}
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
