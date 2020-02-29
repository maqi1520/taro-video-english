import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import {
  Text,
  View,
  ScrollView,
  Image,
  Input,
  Button
} from "@tarojs/components";
import Loading from "../../components/loading/index";
import "./index.scss";
import { format } from "timeago.js";
import { useSelector, useDispatch } from "@tarojs/redux";
import { iRootState, Dispatch } from "../../store/createStore";

interface Props {}

const Login: Taro.FC<Props> = () => {
  const dispatch = useDispatch<Dispatch>();
  const { data, loading, pageNum, pageSize, total } = useSelector(
    (state: iRootState) => state.message
  );
  const [message, setMessage] = useState("");
  const load = useCallback(() => {
    dispatch({ type: "message/query" });
  }, []);
  const handleChange = (e: any) => {
    setMessage(e.target.value);
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return e.target.value;
  };
  const handleOk = useCallback(() => {
    if (message.trim() === "") {
      return;
    }
    setMessage("");
    dispatch({ type: "message/create", payload: { message } });
  }, [load, message]);
  const onScroll = useCallback(() => {
    if (total - pageNum * pageSize > 0) {
      dispatch({ type: "message/save", payload: { pageNum: pageNum + 1 } });
      load();
    }
  }, [total, pageSize, pageNum, load]);
  useEffect(() => {
    load();
    return () => {
      dispatch({
        type: "message/save",
        payload: { data: [], loading: true, pageNum: 1 }
      });
    };
  }, [load]);

  const scrollTop = 0;
  const Threshold = 50;

  return (
    <Loading show={loading}>
      <View className="message-page">
        <ScrollView
          className="body"
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToLower={onScroll}
        >
          {data.map(item => (
            <View className="message" key={item._id}>
              <View className="header">
                <View className="avatar">
                  <Image className="user-avatar" src={item.avatarUrl} />
                </View>
                <View className="title">{item.nickName}</View>
                <View className="note">
                  {format(new Date(item.createAt), "zh_CN")}
                </View>
              </View>
              <View className="message-content">{item.message}</View>
            </View>
          ))}
        </ScrollView>
        <View className="footer">
          <View className="message-sender">
            <Input
              className="text-input"
              name="value"
              value={message}
              onInput={handleChange}
            />
            <View className="btn-send">
              <Button onClick={handleOk} size="mini" type="primary">
                send
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Loading>
  );
};

Login.config = {
  navigationBarTitleText: "Message"
};

export default Login;
