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
import "./index.scss";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";
import Loading from "../../components/loading/index";

interface Props {}

const My: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const showV = useSelector((state: iRootState) => state.category.show);
  const score = useSelector((state: iRootState) => state.score);
  const {
    question,
    choices,
    choose,
    hasStar,
    countdown,
    loading
  } = useSelector((state: iRootState) => state.question);
  const userInfo = useSelector((state: iRootState) => state.userInfo);
  const [show, setShow] = useState<boolean>(true);
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
    Taro.getStorage({
      key: "show",
      success: res => {
        setShow(res.data);
      }
    });
    dispatch({ type: "question/get", payload: { id: router.params.id } });
    return () => {
      dispatch({ type: "question/save", payload: { loading: true } });
    };
  }, [dispatch, router.params]);
  const onGetUserInfo = useCallback(
    e => {
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
        type: "wrongs/create",
        payload: {
          questionId: question._id,
          userId: userInfo._id,
          type: "wrongs"
        }
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
            dispatch({
              type: "question/save",
              payload: {
                choose: "default"
              }
            });
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
    setStep(0);
    dispatch({ type: "question/get", payload: {} });
  }, [dispatch]);
  const onEnded = useCallback(() => {
    if (step === 0) {
      setStep(1);
    }
    dispatch({ type: "question/updateViews", payload: question });
  }, [dispatch, step, question]);
  const handleChange = useCallback(e => {
    setShow(e.target.value);
    Taro.setStorage({
      key: "show",
      data: e.target.value
    });
  }, []);
  const handleChoose = useCallback(
    e => {
      const value = e.target.dataset.key;

      if (!choose) {
        dispatch({
          type: "question/save",
          payload: {
            choose: value
          }
        });
        setStep(2);
      }
    },
    [choose]
  );
  const onStar = useCallback(() => {
    dispatch({ type: "question/updateStars", payload: question });
    dispatch({
      type: "wrongs/create",
      payload: {
        questionId: question._id,
        userId: userInfo._id,
        type: "stars"
      }
    });
    dispatch({
      type: "question/save",
      payload: {
        hasStar: true
      }
    });
  }, [question, userInfo._id, dispatch]);
  const unStar = useCallback(() => {
    dispatch({
      type: "wrongs/remove",
      payload: {
        questionId: question._id,
        userId: userInfo._id,
        type: "stars"
      }
    });
    dispatch({
      type: "question/save",
      payload: {
        hasStar: false
      }
    });
  }, [question._id, userInfo._id, dispatch]);

  return (
    <View className="page">
      <AtMessage />
      <Loading show={loading}>
        {showV && question.video ? (
          <View className="container">
            {step >= 1 ? (
              <View className="time-container">{countdown}</View>
            ) : null}

            <Video
              src={"http://image.maqib.cn" + question.video.sources.mp4}
              autoplay={false}
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
              {hasStar ? (
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
        ) : null}
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
            {step >= 1 || !showV ? (
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
                {choices.map(choice => (
                  <View
                    key={choice}
                    data-key={choice}
                    onClick={handleChoose}
                    className={`choice ${
                      (choose === "answer" || choose === "default") &&
                      choice === "answer"
                        ? "choice-green"
                        : ""
                    } ${
                      (choose === "distractor" || choose === "default") &&
                      choice === "distractor"
                        ? "choice-red"
                        : ""
                    }`}
                  >
                    {question.choices[choice]}
                  </View>
                ))}
              </View>
            ) : null}
            {step === 2 ? (
              <Button type="primary" onClick={load} className="mt">
                Next
              </Button>
            ) : null}
          </View>
        )}
      </Loading>
    </View>
  );
};

My.config = {
  navigationBarTitleText: "listen"
};

export default My;
