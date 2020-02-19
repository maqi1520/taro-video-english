import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import { View, Text, Video } from "@tarojs/components";
import { AtAvatar, AtRadio, AtButton } from "taro-ui";
import cl from "classnames";
import "./index.scss";

interface Props {}
interface IuserInfo {
  nickName?: string;
  avatarUrl?: string;
}

const data = {
  lastitem: false,
  liked: false,
  stars: 0,
  id: 1797,
  level: 8,
  video: {
    subtitle: "The only one who knows the container number is that guy.",
    distractor:
      "The only one who knows the combination for that safe is that guy.",
    file: "jfd518pvu2z758pa2",
    metadata: {
      name: "The Transporter",
      producer: "Europa Corp.",
      director: "Louis Leterrier",
      details: "",
      related_content_url: "https://www.voscreen.com/related_url/1797/",
      views: "185034"
    },
    sources: {
      mp4: "https://cdn2.voscreen.net/videos/mp4/jfd518pvu2z758pa2.mp4"
    }
  },
  language_code: "zh",
  url: "https://www.voscreen.com/life/1797/jfd518pvu2z758pa2/zh/",
  share_url: "https://www.voscreen.com/life/1797/jfd518pvu2z758pa2/zh/",
  countdown: 18,
  choices: {
    answer:
      "\u552F\u4E00\u77E5\u9053\u96C6\u88C5\u7BB1\u7F16\u53F7\u7684\u662F\u90A3\u4E2A\u4EBA\u3002",
    distractor:
      "\u552F\u4E00\u77E5\u9053\u5B89\u5168\u5BC6\u7801\u7EC4\u5408\u7684\u662F\u90A3\u4E2A\u4EBA\u3002"
  }
};

const My: Taro.FC<Props> = () => {
  const [question, setQuestion] = useState(data);
  const [userInfo, setUserInfo] = useState<IuserInfo>({});
  const [show, setShow] = useState<boolean>(false);
  const [choose, setChoose] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  useEffect(() => {
    Taro.getUserInfo({
      success: res => {
        setUserInfo(res.userInfo);
      }
    });
  }, []);
  const onEnded = useCallback(() => {
    if (step === 0) {
      setStep(1);
    }
  }, []);
  const handleChange = useCallback(value => {
    setShow(value);
    setStep(2);
  }, []);
  const handleChoose = useCallback(value => {
    setChoose(value);
    setStep(3);
  }, []);
  return (
    <View className="userinfo">
      <View className="at-row">
        <View className="at-col">
          <AtAvatar image={userInfo.avatarUrl}></AtAvatar>
        </View>
        <View className="at-col">
          <Text>{userInfo.nickName}</Text>
        </View>
        <View className="at-col">
          <Text></Text>
        </View>
      </View>
      <View className="container">
        <Video
          src={question.video.sources.mp4}
          controls={true}
          autoplay={false}
          style={{ width: "100%", height: "56.25vw" }}
          poster="http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg"
          initialTime={0}
          id="video"
          onEnded={onEnded}
          loop={false}
          muted={false}
        />
      </View>
      <View className="choose">
        {step === 1 ? (
          <AtRadio
            options={[
              { label: "显示字幕", value: true },
              { label: "不显示字幕", value: false }
            ]}
            value={show}
            onClick={handleChange}
          />
        ) : null}
        {step >= 2 ? (
          <View>
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
        {step === 3 ? <AtButton className="container">下一个</AtButton> : null}
      </View>
    </View>
  );
};

My.config = {
  navigationBarTitleText: "我的"
};

export default My;
