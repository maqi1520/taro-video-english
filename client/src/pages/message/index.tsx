import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { AtTextarea, AtCard } from "taro-ui";
import "./index.scss";

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

interface IItem {
  _id: string;
  message: string;
  nickName?: string;
  avatarUrl?: string;
  createAt: string;
}

interface Props {}

const Login: Taro.FC<Props> = () => {
  const [data, setData] = useState<IItem[]>([]);
  const [message, setMessage] = useState("");
  const load = useCallback(() => {
    Taro.cloud
      .callFunction({
        name: "message",
        data: {
          parentId: "0"
        }
      })
      .then(res => {
        if (res && res.result) {
          setData(res.result.data);
        }
      });
  }, []);
  const handleChange = (event: any) => {
    setMessage(event.target.value);
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return event.target.value;
  };
  const handleOk = useCallback(() => {
    if (message.trim() === "") {
      return;
    }
    setMessage("");
    Taro.cloud
      .callFunction({
        name: "createMessage",
        data: {
          message
        }
      })
      .then(res => {
        if (res && res.result) {
          load();
        }
      });
  }, [load, message]);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <View className="page">
      {data.map((item: IItem) => (
        <View key={item._id}>
          <AtCard
            className="mt"
            note={dateFormat("YYYY-mm-dd HH:MM", new Date(item.createAt))}
            title={item.nickName}
            thumb={item.avatarUrl}
          >
            {item.message}
          </AtCard>
        </View>
      ))}
      <View className="mt">
        <AtTextarea value={message} onChange={handleChange} autoHeight />
      </View>
      <View className="mt">
        <Button type="primary" onClick={handleOk}>
          send
        </Button>
      </View>
    </View>
  );
};

Login.config = {
  navigationBarTitleText: "Message"
};

export default Login;
