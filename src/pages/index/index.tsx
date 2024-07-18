import { View, Button, Text, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { requirePlugin, useDidShow } from "@tarojs/taro";
import classnames from "classnames";
import { handleAuth } from "@/utils";
import { useCommonStore } from "@/store";
import { IRecord } from "@/store/common";
import Lottie from "../../components/Lottie";
import VoicePng from "./image/voice.png";
import "./index.less";

const plugin = requirePlugin("WechatSI");

const manager = plugin.getRecordRecognitionManager();

export default function Index() {
  const { recordList, setRecordList } = useCommonStore();
  const [start, setStart] = useState(false);
  const [haveSetting, setHaveSetting] = useState(true);

  useDidShow(() => {
    // const newRecordList = Taro.getStorageSync("recordList");

    // setRecordList(newRecordList || []);
    initRecord();
    Taro.getSetting({
      success(result) {
        if (result.authSetting["scope.record"]) {
          setHaveSetting(true);
        } else {
          setHaveSetting(false);
        }
      },
    });
  });

  const handleTouchStart = async () => {
    if (haveSetting) {
      setStart(true);
      manager.start({
        lang: "zh_CN",
        duration: 30000,
      });
    } else {
      const result = await handleAuth("scope.record");
      if (result) {
        setHaveSetting(true);
      }
    }
  };

  const handleTouchEnd = () => {
    setStart(false);
    manager.stop();
  };

  const initRecord = () => {
    manager.onStart = () => {};
    manager.onRecognize = (res) => {};
    manager.onStop = (res) => {
      setStart(false);
      Taro.showModal({
        title: "识别结果",
        content: res.result,
        confirmText: "记录",

        success(result) {
          if (result.confirm) {
            const newRecordList = [
              ...recordList,
              {
                id: recordList.length + 1,
                time: new Date().getTime(),
                content: res.result,
              },
            ];
            setRecordList(newRecordList as IRecord[]);
            Taro.navigateTo({
              url: "/pages/result/index",
            });
          }
        },
      });
    };
    manager.onError = (error) => {};
  };

  return (
    <View className="index">
      <View className="description">
        <View className={classnames("lottie", start && "show")}>
          <Lottie
            path="https://static-mp-40374afd-2b0f-46aa-956d-48c41c9cc959.next.bspapp.com/wave.json"
            loop={true}
            autoplay
            elementId="bgElement"
            // animationData={lottieJson}
          ></Lottie>
        </View>
        {!start && (
          <View className="adver">
            <Text>释放声音，捕捉每一个文字.</Text>
            <Text>让每一个灵感都被记录，让每一个瞬间都被珍惜.</Text>
          </View>
        )}
      </View>
      <Button
        className={classnames("speak", start && "start")}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          console.log("fds");
        }}
      >
        <Image src={VoicePng}></Image>
      </Button>
      <View
        className="my__record"
        onClick={() => {
          Taro.navigateTo({
            url: "/pages/result/index",
          });
        }}
      >
        我的瞬间
      </View>
    </View>
  );
}
