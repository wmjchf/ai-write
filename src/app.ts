import { PropsWithChildren, useEffect } from "react";
import Taro, { useLaunch } from "@tarojs/taro";
import "./app.less";
import "./app.scss";
import { useCommonStore } from "./store";

import { DEFAULT_SETTING } from "./constant/data";

function App({ children }: PropsWithChildren<any>) {
  const { setRecordList, setUser } = useCommonStore();
  const cloudInit = () => {
    if (!Taro.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      Taro.cloud.init({
        env: "ai-write-1gxmsnceff9bc8c9",
        traceUser: true,
      });
    }
  };

  useLaunch(() => {
    console.log("App launched.");
  });

  useEffect(() => {
    const recordList = Taro.getStorageSync("recordList");
    const user = Taro.getStorageSync("user");

    setRecordList(recordList || []);
    setUser(user || DEFAULT_SETTING);
    // cloudInit();
  }, []);

  // children 是将要会渲染的页面
  return children;
}

export default App;
