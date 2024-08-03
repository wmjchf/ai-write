import { View, Button, Image, Text } from "@tarojs/components";
import { useRef, useState } from "react";
import Taro, { requirePlugin, useDidShow } from "@tarojs/taro";
import classnames from "classnames";
import { handleAuth } from "@/utils";
import { CustomerHeader } from "@/components/Header";
import { useCommonStore } from "@/store";
import { IRecord } from "@/store/common";
import FontPng from "./image/font.png";
import Lottie from "../../components/Lottie";
import VoicePng from "./image/voice.png";
import PPng from "./image/p.png";
import "./index.less";
import { DEFAULT_SETTING } from "@/constant/data";

const plugin = requirePlugin("WechatSI");

const manager = plugin.getRecordRecognitionManager();
function generateUniqueRandomNumber() {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timePart = Date.now().toString(36);
  return randomPart + timePart;
}
export default function Index() {
  const { recordList, setRecordList, user } = useCommonStore();
  const [data, setData] = useState<IRecord | null>(null);
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
    //     id: "1",
    //     time: new Date().getTime(),
    //     content:
    //       "PEPE币是一种基于互联网迷因（meme）文化的加密货币，它以“Pepe the Frog”这一经典的互联网表情为灵感，PEPE币试图通过区块链技术为这一文化符号赋予新的意义，并且PEPE代币喊出了“让 Memecoins 再次伟大”的口号。",
    //     setting: DEFAULT_SETTING,
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
      // timerRef.current = setInterval(() => {
      //   const value = timeRef.current - 1 >= 0 ? timeRef.current - 1 : 0;
      //   setTime(value);
      //   timeRef.current = value;
      // }, 1000);
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
    // setTime(30);
    clearInterval(timerRef.current);
    timeRef.current = 30;
  };

  const initRecord = () => {
    manager.onStart = () => {};
    manager.onRecognize = (res) => {};
    manager.onStop = (res) => {
      setStart(false);
      // setTime(30);
      // clearInterval(timerRef.current);
      timeRef.current = 30;
      Taro.showModal({
        title: "识别结果",
        content: res.result,
        confirmText: "分享",
        cancelText: "复制",
        success(result) {
          if (result.confirm) {
            const newData = {
              id: generateUniqueRandomNumber(),
              time: new Date().getTime(),
              content: res.result,
              setting: user,
            };
            // const newRecordList = [newData, ...recordList];
            const newRecordList = [newData];
            setRecordList(newRecordList as IRecord[]);

            Taro.navigateTo({
              url: `/pages/detail/index?id=${newData.id}`,
            });
          } else {
            Taro.setClipboardData({
              data: res.result,
            });
          }
        },
      });
    };
    manager.onError = (error) => {};
  };

  return (
    <View className="index">
      {/* <View className="time__second">
        <Text>{time}</Text>
      </View> */}
      <CustomerHeader
        position="absolute"
        background="transparent"
        backNode={
          <View
            className="privary"
            onClick={() => {
              Taro.navigateTo({
                url: "/pages/privacy/index",
              });
            }}
          >
            <Image src={PPng} />
            <Text>隐私政策</Text>
          </View>
        }
      ></CustomerHeader>
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
            {/* <Text>释放声音，捕捉每一个文字.</Text>
            <Text>让每一个灵感都被记录，让每一个瞬间都被珍惜.</Text> */}
            <Image src={FontPng}></Image>
          </View>
        )}
      </View>
      {!data && (
        <Button
          className={classnames("speak", start && "start")}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image src={VoicePng}></Image>
        </Button>
      )}

      {!data && recordList[0] && (
        <View
          className="my__record"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/detail/index?id=${recordList[0]?.id}`,
            });
          }}
        >
          瞬间回溯
        </View>
      )}
      {/* {data && (
        <Poster
          data={data}
          onSaveSuccess={() => {
            const newRecordList = [data, ...recordList];
            setRecordList(newRecordList as IRecord[]);
            setData(null);
          }}
        ></Poster>
      )} */}
    </View>
  );
}
