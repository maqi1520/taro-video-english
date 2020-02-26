import Taro, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useShareAppMessage,
  useRouter
} from "@tarojs/taro";
import { View, Text, Video, Button, Switch } from "@tarojs/components";
import { AtMessage, AtIcon } from "taro-ui";
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
  const { question, countdown } = useSelector(
    (state: iRootState) => state.question
  );
  const userInfo = useSelector((state: iRootState) => state.userInfo);
  const [choices, setChoices] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [choose, setChoose] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const ref = useRef<ReturnType<typeof setTimeout>>();
  useShareAppMessage((res: any) => {
    if (res.from === "button") {
      // 来自页面内转发按钮
      const { name, id } = res.target.dataset;
      return {
        title: name,
        path: "/pages/listen/index?id=" + id,
        imageUrl: ""
      };
    }
  });
  const router = useRouter();
  useEffect(() => {
    dispatch({ type: "score/get" });
    dispatch({ type: "question/get", payload: { id: router.params.id } });
    setChoices(randomChoices());
  }, [dispatch, router.params]);
  const onGetUserInfo = useCallback(
    e => {
      console.log(e.detail.userInfo);
      dispatch({ type: "userInfo/get", payload: e.detail.userInfo });
    },
    [dispatch]
  );
  const setScore = useCallback(() => {
    let newScore = { ...score };
    if (choose === "answer") {
      Taro.atMessage({
        message: `score +${countdown}`,
        type: "success"
      });
      newScore.points = score.points + countdown;
      newScore.success = score.success + 1;
    } else {
      const failPoints = Math.floor(question.countdown / 2);
      newScore.points = score.points - failPoints;
      newScore.fail = score.fail + 1;
      dispatch({
        type: "userInfo/updateWrongs",
        payload: { questionId: question._id }
      });
      Taro.atMessage({
        message: `score -${failPoints}`,
        type: "warning"
      });
    }
    dispatch({ type: "score/update", payload: newScore });
  }, [dispatch, question.countdown, question._id, choose, score, countdown]);
  useEffect(() => {
    if (userInfo) {
      const newCountdown = countdown - 1;
      if (step === 1 && !choose && newCountdown >= 0) {
        ref.current = setTimeout(() => {
          dispatch({
            type: "question/save",
            payload: {
              countdown: newCountdown
            }
          });
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
  }, [countdown, userInfo, dispatch, choose, step, setScore]);

  const load = useCallback(() => {
    setShow(false);
    setStep(0);
    setChoose("");
    dispatch({ type: "question/get", payload: {} });
    setChoices(randomChoices());
  }, [dispatch]);
  const onEnded = useCallback(() => {
    dispatch({ type: "question/updateViews", payload: question });
    if (step === 0) {
      setStep(1);
    }
  }, [dispatch, question]);
  const handleChange = useCallback(e => {
    setShow(e.target.value);
  }, []);
  const handleChoose = useCallback(
    value => {
      if (!choose) {
        setChoose(value);
        setStep(2);
      }
    },
    [choose]
  );
  const onStar = useCallback(() => {
    const questionId = question._id;
    const userId = userInfo._id;
    const stars = question.stars + 1;
    const userStars = [...userInfo.stars, questionId];
    dispatch({
      type: "userInfo/updateStar",
      payload: { questionId, stars, userId, userStars }
    });
  }, [userInfo.stars, question._id, userInfo._id, userInfo.stars, dispatch]);
  const unStar = useCallback(() => {
    const questionId = question._id;
    const userId = userInfo._id;
    const stars = question.stars - 1;
    let userStars = userInfo.stars.filter(id => id !== questionId);
    dispatch({
      type: "userInfo/updateStar",
      payload: { questionId, stars, userId, userStars }
    });
  }, [userInfo.stars, question._id, userInfo._id, userInfo.stars, dispatch]);
  if (!question.video) {
    return null;
  }

  return (
    <View className="page">
      <AtMessage />
      <View className="container">
        {step >= 1 ? <View className="time-container">{countdown}</View> : null}
        <Video
          src={"http://image.maqib.cn" + question.video.sources.mp4}
          autoplay={false}
          controls
          style={{ width: "100%", height: "56.25vw" }}
          id="video"
          onEnded={onEnded}
        />
        <View className="video-desc clearfix">
          <View className="video-name">
            <View>{question.video.metadata.name}</View>
          </View>
          <View className="video-icon">
            <AtIcon size="20" value="eye"></AtIcon>
            <Text>{question.video.metadata.views}</Text>
          </View>
          {userInfo.stars.indexOf(question._id) > -1 ? (
            <View onClick={unStar} className="video-icon active">
              <AtIcon size="19" color="#F00" value="star" />
              <Text>{question.stars}</Text>
            </View>
          ) : (
            <View onClick={onStar} className="video-icon">
              <AtIcon size="19" value="star" />
              <Text>{question.stars}</Text>
            </View>
          )}
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
      {!userInfo.nickName ? (
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
