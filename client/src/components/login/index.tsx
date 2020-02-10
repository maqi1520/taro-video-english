import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";

interface IItem {
  _id: string;
  name: string;
}
interface IuserInfo {}

interface Props {}

const Login: React.FC<Props> = () => {
  const [data, setData] = useState<IItem[]>([]);
  const [userInfo, setUserInfo] = useState<IuserInfo>({});
  useEffect(() => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {
          parentId: "0"
        }
      })
      .then(res => {
        if (res && res.result) {
          console.log(res.result.data);

          setData(res.result.data);
          setUserInfo(res.result.userInfo);
        }
      });
  }, []);

  return (
    <View className="index">
      {data.map((item: IItem) => (
        <View key={item._id}>{item.name}</View>
      ))}
    </View>
  );
};

export default Login;
