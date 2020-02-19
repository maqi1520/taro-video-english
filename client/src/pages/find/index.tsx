import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Create from "../../components/tree/Create";
import "./index.scss";

interface IItem {
  _id: string;
  name: string;
}
interface IuserInfo {}

interface Props {}

const Login: Taro.FC<Props> = () => {
  const [data, setData] = useState<IItem[]>([]);
  const [userInfo, setUserInfo] = useState<IuserInfo>({});
  const load = useCallback(() => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {
          parentId: "0"
        }
      })
      .then(res => {
        if (res && res.result) {
          setData(res.result.data);
          setUserInfo(res.result.userInfo);
        }
      });
  }, []);
  const handleOk = useCallback(
    name => {
      Taro.cloud
        .callFunction({
          name: "createTree",
          data: {
            name
          }
        })
        .then(res => {
          if (res && res.result) {
            load();
          }
        });
    },
    [load]
  );
  useEffect(() => {
    load();
  }, [load]);

  return (
    <View className="page">
      <Create onOk={handleOk}>新建</Create>
      <View className="list">
        {data.map((item: IItem) => (
          <View key={item._id}>{item.name}</View>
        ))}
      </View>
    </View>
  );
};

Login.config = {
  navigationBarTitleText: "搜索"
};

export default Login;
