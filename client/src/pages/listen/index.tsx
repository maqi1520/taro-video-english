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
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";

interface Props {}

const randomChoices = () =>
  ["answer", "distractor"].sort(() => {
    return Math.random() > 0.5 ? -1 : 1;
  });

const My: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const score = useSelector((state: iRootState) => state.score);
  const question = useSelector((state: iRootState) => state.question);
  const userInfo = useSelector((state: iRootState) => state.userInfo);
  const [choices, setChoices] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [choose, setChoose] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const ref = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    // 获取用户信息
    Taro.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          Taro.getUserInfo({
            success: res => {
              dispatch({ type: "userInfo/get", payload: res.userInfo });
            }
          });
        }
      }
    });
    dispatch({ type: "score/get" });
    dispatch({ type: "question/get" });
    setChoices(randomChoices());
  }, [dispatch]);
  const onGetUserInfo = useCallback(
    e => {
      console.log(e.detail.userInfo);
      dispatch({ type: "userInfo/get", payload: e.detail.userInfo });
    },
    [dispatch]
  );
  const setScore = useCallback(() => {
    if (question) {
      let newScore = { ...score };
      if (choose === "answer") {
        Taro.atMessage({
          message: `score +${question.countdown}`,
          type: "success"
        });
        newScore.points = score.points + question.countdown;
        newScore.success = score.success + 1;
      } else {
        newScore.points = score.points - 3;
        newScore.fail = score.fail + 1;
        Taro.atMessage({
          message: `score -3`,
          type: "warning"
        });
      }
      dispatch({ type: "score/update", payload: newScore });
    }
  }, [dispatch, choose, score, question]);
  useEffect(() => {
    if (question && userInfo) {
      const countdown = question.countdown - 1;
      if (step === 1 && !choose && countdown >= 0) {
        ref.current = setTimeout(() => {
          const newQuestion = {
            ...question,
            countdown
          };
          dispatch({ type: "question/save", payload: newQuestion });
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
  }, [question, userInfo, dispatch, choose, step, setScore]);

  const load = useCallback(() => {
    setShow(false);
    setStep(0);
    setChoose("");
    dispatch({ type: "question/get" });
    setChoices(randomChoices());
  }, [dispatch]);
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
  if (!question) {
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
          <View>
            <View className="user-name">
              <OpenData type="userNickName" />
            </View>
            Score:<Text className="score">{score.points}</Text>
          </View>
        </View>
        <View className="userinfo-right">
          <Button
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/ranking/index"
              });
            }}
            size="mini"
            type="primary"
          >
            排行榜
          </Button>
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
      {!userInfo ? (
        <View className="login-container">
          <Button
            type="primary"
            size="mini"
            onGetUserInfo={onGetUserInfo}
            openType="getUserInfo"
          >
            授权登录
          </Button>
          <View className="mt">授权后查看字幕，选择正确的答案</View>
        </View>
      ) : (
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
      )}
    </View>
  );
};

My.config = {
  navigationBarTitleText: "listen"
};

export default My;
