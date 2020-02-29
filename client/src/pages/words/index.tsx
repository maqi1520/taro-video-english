import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import Loading from "../../components/loading/index";
import { AtTextarea, AtMessage } from "taro-ui";
import Create from "../../components/tree/Create";
import "./index.scss";

interface IItem {
  _id: string;
  content: string;
}

interface IRes {
  errMsg: string;
  result: {
    data: IItem[];
  };
}

interface Props {}

const Login: Taro.FC<Props> = () => {
  const [data, setData] = useState<IItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const load = useCallback(() => {
    Taro.cloud
      .callFunction({
        name: "getSweetNothing",
        data: {}
      })
      .then(res => {
        if (res && res.result) {
          setData((res as IRes).result.data);
          setLoading(false);
        }
      });
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const handleOk = useCallback(
    name => {
      Taro.cloud
        .callFunction({
          name: "createSweetNothing",
          data: {
            type: "默认分类",
            content: name,
            linkCount: 0,
            disLikeCount: 0,
            status: 0
          }
        })
        .then(res => {
          if (res && res.result) {
            Taro.atMessage({
              message: "投稿成功，等待审核通过，感谢您的参与！",
              type: "success"
            });
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
      <AtMessage />
      <Loading show={loading}>
        <View className="list">
          {data.map((item: IItem) => (
            <AtTextarea
              onChange={() => {}}
              key={item._id}
              value={item.content}
              count={false}
              disabled
            />
          ))}
        </View>

        <View>
          <Button className="mb" type="primary" onClick={load}>
            Next
          </Button>
        </View>
        <Create onOk={handleOk}>Send</Create>
      </Loading>
    </View>
  );
};

Login.config = {
  navigationBarTitleText: "Honeyed words"
};

export default Login;
