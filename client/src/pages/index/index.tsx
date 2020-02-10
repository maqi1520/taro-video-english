import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";

import { AtTextarea, AtMessage } from "taro-ui";
import Create from "../../components/tree/Create";
import "./index.scss";

interface IItem {
  _id: string;
  content: string;
}
interface IuserInfo {}

interface Props {}

const Login: Taro.FC<Props> = () => {
  const [data, setData] = useState<IItem[]>([]);
  const [userInfo, setUserInfo] = useState<IuserInfo>({});
  const load = useCallback(() => {
    Taro.cloud
      .callFunction({
        name: "getSweetNothing",
        data: {}
      })
      .then(res => {
        if (res && res.result) {
          setData(res.result.data);
          setUserInfo(res.result.userInfo);
        }
      });
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const fallback = useCallback(() => {
    Taro.atMessage({
      message: "投稿成功，等待审核通过，感谢您的参与！",
      type: "success"
    });
  }, []);

  return (
    <View className="page">
      <AtMessage />
      <View className="list">
        {data.map((item: IItem) => (
          <AtTextarea
            onChange={() => {}}
            key={item._id}
            value={item.content}
            count={false}
            autoHeight
            disabled
          />
        ))}
      </View>
      <Button className="mb" type="primary" onClick={load}>
        换一条
      </Button>
      <Create reload={fallback}>投稿</Create>
    </View>
  );
};

Login.config = {
  navigationBarTitleText: "屌丝-说话的艺术"
};

export default Login;
