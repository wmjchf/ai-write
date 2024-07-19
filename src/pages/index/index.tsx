import { View, Button, Text, Image } from "@tarojs/components";
import { useEffect, useRef, useState } from "react";
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
  const [time, setTime] = useState(30);
  const timeRef = useRef<number>(30);
  const timerRef = useRef<any>();
  useDidShow(() => {
    // const newRecordList = Taro.getStorageSync("recordList");

    // setRecordList(newRecordList || []);
    // Taro.setStorageSync("recordList", [
    //   {
    //     id: 1,
    //     time: new Date().getTime(),
    //     content:
    //       "Web3打破数据孤岛，为AI推荐算法的未来带来了无限畅想。个性化推荐、跨平台协同、隐私保护、透明与公平、实时动态推荐和社区驱动优化等具体场景展示了Web3与AI推荐算法结合的巨大潜力。这些创新将推动推荐算法的精准性、公正性和用户体验的提升，塑造一个更加智能、个性化和信任的数字生态系统。",
    //   },
    // ]);
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
      timerRef.current = setInterval(() => {
        const value = timeRef.current - 1 >= 0 ? timeRef.current - 1 : 0;
        setTime(value);
        timeRef.current = value;
      }, 1000);
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
    setTime(30);
    clearInterval(timerRef.current);
    timeRef.current = 30;
  };

  const initRecord = () => {
    manager.onStart = () => {};
    manager.onRecognize = (res) => {};
    manager.onStop = (res) => {
      setStart(false);
      setTime(30);
      clearInterval(timerRef.current);
      timeRef.current = 30;
      Taro.showModal({
        title: "识别结果",
        content: res.result,
        confirmText: "记录",

        success(result) {
          if (result.confirm) {
            const newRecordList = [
              {
                id: recordList.length + 1,
                time: new Date().getTime(),
                content: res.result,
              },
              ...recordList,
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
      <View className="time__second">
        <Text>{time}</Text>
      </View>
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
