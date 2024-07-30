import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, View, Image, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { IRecord, useCommonStore } from "@/store/common";
import { DrawCanvas } from "@/components/DrawCanvas";
import { COLOR_OPTION, DEFAULT_SETTING, WEIGHT_OPTION } from "@/constant/data";
import { handleAuth } from "@/utils";
import dayjs from "dayjs";
import ContentPng from "./image/content.png";
import StylePng from "./image/style.png";
import SharePng from "./image/share.png";
import styles from "./index.module.less";

interface IPoster {
  data?: IRecord;
  onSaveSuccess?: () => void;
  onLoad?: () => void;
}
export const Poster: React.FC<IPoster> = (props) => {
  const { data, onSaveSuccess, onLoad } = props;
  const [factor, setFactor] = useState(0);

  const pathRef = useRef<string>();
  const [loading, setLoading] = useState(true);
  const [haveSetting, setHaveSetting] = useState(true);

  const height = parseInt(data?.setting?.height || DEFAULT_SETTING.height);
  const fontSize = parseInt(
    data?.setting?.fontSize || DEFAULT_SETTING.fontSize
  );
  const x = parseInt(data?.setting?.x || DEFAULT_SETTING.x);
  const y = parseInt(data?.setting?.y || DEFAULT_SETTING.y);
  const weight = data?.setting?.fontWeight || DEFAULT_SETTING.fontWeight;
  const showWater = data?.setting?.showWater;
  const backgroundImage =
    data?.setting?.backgroundImage || DEFAULT_SETTING.backgroundImage;
  const qrcodeUrl = data?.setting?.qrcodeUrl || DEFAULT_SETTING.qrcodeUrl;
  const fontColor =
    data?.setting?.fontColor == null
      ? DEFAULT_SETTING.fontColor
      : data?.setting?.fontColor;
  const customBackgroundImage =
    data?.setting?.customBackgroundImage === undefined
      ? DEFAULT_SETTING.customBackgroundImage
      : data?.setting?.customBackgroundImage;
  const customQRCodeUrl =
    data?.setting?.customQRCodeUrl || DEFAULT_SETTING.customQRCodeUrl;
  const showAvatar =
    data?.setting?.showAvatar === undefined
      ? DEFAULT_SETTING.showAvatar
      : data?.setting?.showAvatar;
  const showNick =
    data?.setting?.showNick === undefined
      ? DEFAULT_SETTING.showNick
      : data?.setting?.showNick;

  useEffect(() => {
    const sysInfo = Taro.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    setFactor(screenWidth / 750);

    Taro.getSetting({
      success(result) {
        if (result.authSetting["scope.writePhotosAlbum"]) {
          setHaveSetting(true);
        } else {
          setHaveSetting(false);
        }
      },
    });
  }, []);

  const Drawer = useMemo(() => {
    if (factor && data) {
      return (
        <DrawCanvas
          config={{
            canvasId: "poster",
            width: 650,
            height: height,
            factor,
            hideLoading: false,
            images: [
              {
                width: 650,
                height: height,
                type: "image",
                x: 0,
                y: 0,
                // borderRadius: 32,
                url: customBackgroundImage
                  ? backgroundImage
                  : DEFAULT_SETTING.backgroundImage,

                blur: false,
              },
              {
                width: 250,
                height: 250,
                type: "image",
                x: 400,
                y: 850,
                url: customQRCodeUrl ? qrcodeUrl : DEFAULT_SETTING.qrcodeUrl,
              },
            ],
            // blocks: [
            //   {
            //     width: 100,
            //     height: 100,
            //     borderRadius: 100,
            //     backgroundColor: "#fff",
            //     x: 475,
            //     y: 925,
            //     type: "block",
            //     zIndex: 10000,
            //   },
            // ],
            // qrcodes: [
            //   {
            //     width: 250,
            //     height: 250,
            //     x: 400,
            //     y: 850,
            //     text: `昵称：${data.setting.nickname}\n时间：${dayjs(
            //       data.time
            //     ).format("YYYY-MM-DD HH:mm:ss")}`,
            //     type: "qrcode",
            //   },
            // ],
            texts: [
              {
                text: data.content,
                type: "text",
                width: 520,
                lineNum: 20,
                lineHeight: 45,
                x,
                y,
                fontSize,
                color: COLOR_OPTION[fontColor].value,
                fontFamily: "Times New Roman",
                fontWeight: WEIGHT_OPTION[weight].value,
              },
              {
                text: dayjs(data.time).format("YYYY-MM-DD HH:mm:ss"),
                type: "text",
                width: 500,
                lineNum: 1,
                lineHeight: 40,

                x: 24,
                y: 1080,
                fontSize: 28,
                color: "#cdcdcd",
                fontFamily: "Times New Roman",
              },
              {
                text: data?.setting?.nickname as string,
                type: "text",
                width: 500,
                lineNum: 1,
                lineHeight: 40,
                x: 24,
                y: 240,
                fontSize: 55,
                color: COLOR_OPTION[fontColor].value,
                fontWeight: "bold",
                fontFamily: "Times New Roman",
                // textAlign: "center",
                opacity: showNick ? 1 : 0,
              },
            ],
          }}
          onCreateFail={(err) => {
            console.log(err);
          }}
          onCreateSuccess={(result) => {
            pathRef.current = result.tempFilePath;
          }}
          onLoad={() => {
            setLoading(false);
            onLoad && onLoad();
          }}
        ></DrawCanvas>
      );
    }
  }, [
    factor,
    data,
    fontSize,
    height,
    x,
    y,
    weight,
    onLoad,
    showWater,
    showAvatar,
  ]);

  return (
    <View
      className={styles.poster}
      onClick={(event) => {
        event.stopPropagation();
        onSaveSuccess && onSaveSuccess();
      }}
    >
      {Drawer}
      {!loading && (
        <View className={styles.operation}>
          <View
            className={styles.save}
            onClick={async (event) => {
              event.stopPropagation();
              if (haveSetting) {
                Taro.saveImageToPhotosAlbum({
                  filePath: pathRef.current as string,
                  success(res) {
                    onSaveSuccess && onSaveSuccess();
                    Taro.showToast({
                      title: "保存成功",
                    });
                  },
                  fail(error) {
                    console.log(error);
                  },
                });
              } else {
                const result = await handleAuth(
                  "scope.writePhotosAlbum",
                  "需要保存图片到相册"
                );
                if (result) {
                  setHaveSetting(true);
                }
              }
            }}
          >
            <View className={styles.image}>
              <Image src={SharePng} />
            </View>
            {/* <Text>下载分享</Text> */}
          </View>
          <View
            className={styles.save}
            onClick={async (event) => {
              event.stopPropagation();
              Taro.navigateTo({
                url: `/pages/user/index?id=${data?.id}`,
              });
            }}
          >
            <View className={styles.image}>
              <Image src={ContentPng} />
            </View>
            {/* <Text>自定义内容</Text> */}
          </View>
          <View
            className={styles.save}
            onClick={async (event) => {
              event.stopPropagation();
            }}
            style={{
              marginRight: 0,
            }}
          >
            <View className={styles.image}>
              <Image src={StylePng} />
            </View>
            {/* <Text>自定义样式</Text> */}
          </View>
        </View>
      )}
    </View>
  );
};
