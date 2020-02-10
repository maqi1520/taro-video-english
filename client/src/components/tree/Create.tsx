import { Button, View } from "@tarojs/components";
import Taro, { useState, useCallback } from "@tarojs/taro";
import { AtModal, AtModalAction, AtModalContent, AtTextarea } from "taro-ui";

interface Props {
  reload: () => void;
  className?: string;
  children?: string;
}

const Create: Taro.FC<Props> = props => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");

  const handleChange = (event: any) => {
    setName(event.target.value);
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return event.target.value;
  };

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);
  const onClose = useCallback(() => {
    setName("");
    setVisible(false);
  }, []);
  const saveFile = useCallback(() => {
    if (name.trim() === "") {
      return;
    }
    onClose();
    Taro.cloud
      .callFunction({
        name: "createTree",
        data: {
          name
        }
      })
      .then(res => {
        if (res && res.result) {
          props.reload();
        }
      });
  }, [name, onClose, props.reload]);
  return (
    <View>
      <Button className={props.className} onClick={handleClick}>
        {props.children}
      </Button>
      <AtModal onClose={onClose} isOpened={visible}>
        <AtModalContent>
          <AtTextarea value={name} onChange={handleChange} autoHeight />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={saveFile}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};
Create.defaultProps = {
  children: "新建"
};

export default Create;
