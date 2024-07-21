import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { IRecord, useCommonStore } from "@/store/common";
import { DrawCanvas } from "@/components/DrawCanvas";
import { WEIGHT_OPTION } from "@/constant/data";
import { handleAuth } from "@/utils";
import dayjs from "dayjs";
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

  const height = parseInt(data?.setting?.height || "1100");
  const fontSize = parseInt(data?.setting?.fontSize || "26");
  const x = parseInt(data?.setting?.x || "48");
  const y = parseInt(data?.setting?.y || "350");
  const weight = data?.setting?.fontWeight || 0;
  const showWater = data?.setting?.showWater;

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
                url: "https://static-mp-40374afd-2b0f-46aa-956d-48c41c9cc959.next.bspapp.com/canvas_1.png",
              },
              {
                width: 200,
                height: 200,
                type: "image",
                borderRadius: 200,
                x: 225,
                y: height - 250,
                url: "https://static-mp-40374afd-2b0f-46aa-956d-48c41c9cc959.next.bspapp.com/qrcode.jpg",
              },
              {
                width: 150,
                height: 150,
                type: "image",
                borderRadius: 150,
                x: 250,
                y: 140,
                url: data?.setting?.avatarUrl as string,
              },
            ],

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
                color: "#333",
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
                y: 110,
                fontSize: 25,
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
                y: 70,
                fontSize: 55,
                color: "#cdcdcd",
                fontFamily: "Times New Roman",
                // textAlign: "center",
              },
              {
                text: "音瞬官方认证",
                type: "text",
                width: 360,
                lineNum: 1,
                lineHeight: 40,
                x: 410,
                y: 1070,
                fontSize: 35,
                color: "rgba(230, 230, 230, 0.3)",
                fontFamily: "Times New Roman",
                opacity: showWater ? 1 : 0,
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
  }, [factor, data, fontSize, height, x, y, weight, onLoad]);

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
        <Button
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
          保存图片到相册
        </Button>
      )}
    </View>
  );
};
