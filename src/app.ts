import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";
import "./app.less";
import { useCommonStore } from "./store";
import { DEFAULT_SETTING } from "./constant/data";

function App({ children }: PropsWithChildren<any>) {
  const { setRecordList, setUser } = useCommonStore();
  useLaunch(() => {
    console.log("App launched.");
  });

  useEffect(() => {
    const recordList = Taro.getStorageSync("recordList");
    const user = Taro.getStorageSync("user");

    setRecordList(recordList || []);
    setUser(user || DEFAULT_SETTING);
  }, []);

  // children 是将要会渲染的页面
  return children;
}

export default App;
