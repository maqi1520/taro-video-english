import Taro, { useState, useEffect, useCallback, useRef } from "@tarojs/taro";
import {
  View,
  Text,
  Video,
  Button,
  Switch,
  OpenData
} from "@tarojs/components";
import { AtMessage } from "taro-ui";
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
  _id: string;
  nickName?: string;
  avatarUrl?: string;
  score: {
    points: number;
    success: number;
    fail: number;
  };
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

const getUserProfile = (userInfo): Promise<any> => {
  return Taro.cloud.callFunction({
    name: "user_profile",
    data: {
      userInfo
    }
  });
};

const randomChoices = () =>
  ["answer", "distractor"].sort(() => {
    return Math.random() > 0.5 ? -1 : 1;
  });

const My: Taro.FC<Props> = () => {
  const [question, setQuestion] = useState<Iquestion | undefined>();
  const [choices, setChoices] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<IuserInfo>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [choose, setChoose] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const ref = useRef<ReturnType<typeof setTimeout>>();
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
              getUserProfile(res.userInfo).then(r => {
                setUserInfo(r.result);
              });
            }
          });
        }
      }
    });
    getQuestion().then(res => {
      if (res && res.result) {
        setQuestion(res.result.question);
        setChoices(randomChoices());
        setLoading(false);
        Taro.hideLoading();
      }
    });
  }, []);
  const setScore = useCallback(() => {
    if (userInfo && question) {
      let score = { ...userInfo.score };
      if (choose === "answer") {
        Taro.atMessage({
          message: `score +${question.countdown}`,
          type: "success"
        });
        score.points = score.points + question.countdown;
        score.success = score.success + 1;
      } else {
        score.points = score.points - 3;
        score.fail = score.fail + 1;
        Taro.atMessage({
          message: `score -3`,
          type: "warning"
        });
      }
      setUserInfo({
        ...userInfo,
        score
      });
      Taro.cloud.callFunction({
        name: "update_user_profile",
        data: {
          _id: userInfo._id,
          score
        }
      });
    }
  }, [choose, userInfo, question]);
  useEffect(() => {
    if (question) {
      const countdown = question.countdown - 1;
      if (step === 1 && !choose && countdown >= 0) {
        ref.current = setTimeout(() => {
          const newQuestion = {
            ...question,
            countdown
          };
          setQuestion(newQuestion);
        }, 1000);
      } else {
        if (ref.current) {
          clearInterval(ref.current);
          ref.current = undefined;
          if (!choose) {
            setStep(2);
            setChoose("default");
          }
          setScore();
        }
      }
    }
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
      }
    };
  }, [question, choose, step, setScore]);

  const load = useCallback(() => {
    setShow(false);
    setStep(0);
    setChoose("");
    getQuestion().then(res => {
      if (res && res.result) {
        setQuestion(res.result.question);
        setChoices(randomChoices());
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
  }, [question]);
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
      <AtMessage />
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
              Score:<Text className="score">{userInfo.score.points}</Text>
            </View>
          )}
        </View>
      </View>
      <View className="container">
        {step >= 1 ? (
          <View className="time-container">{question.countdown}</View>
        ) : null}
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
            {choices.map(key => (
              <View
                key={key}
                onClick={() => handleChoose(key)}
                className={cl("choice", {
                  "choice-green":
                    key === "answer" &&
                    (choose === "answer" || choose === "default"),
                  "choice-red":
                    key === "distractor" &&
                    (choose === "distractor" || choose === "default")
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
