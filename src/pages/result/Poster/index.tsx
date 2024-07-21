import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { IRecord, useCommonStore } from "@/store/common";
import { DrawCanvas } from "@/components/DrawCanvas";
import { handleAuth } from "@/utils";
import dayjs from "dayjs";
import styles from "./index.module.less";

interface IPoster {
  data?: IRecord;
  onSaveSuccess?: () => void;
}
export const Poster: React.FC<IPoster> = (props) => {
  const { data, onSaveSuccess } = props;
  const [factor, setFactor] = useState(0);
  const { user } = useCommonStore();
  const pathRef = useRef<string>();
  const [loading, setLoading] = useState(true);
  const [haveSetting, setHaveSetting] = useState(true);

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
            height: 1100,
            factor,
            hideLoading: false,
            images: [
              {
                width: 650,
                height: 1100,
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
                y: 850,
                url: "https://static-mp-40374afd-2b0f-46aa-956d-48c41c9cc959.next.bspapp.com/qrcode.jpg",
              },
              {
                width: 150,
                height: 150,
                type: "image",
                borderRadius: 150,
                x: 250,
                y: 140,
                url: user?.avatarUrl as string,
              },
            ],

            texts: [
              {
                text: data.content,
                type: "text",
                width: 520,
                lineNum: 20,
                lineHeight: 45,
                x: 48,
                y: 350,
                fontSize: 26,
                color: "#333",
                fontFamily: "Times New Roman",
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
                text: user?.nickname as string,
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
          }}
        ></DrawCanvas>
      );
    }
  }, [factor, data, user]);

  return (
    <View
      className={styles.poster}
      onClick={() => {
        onSaveSuccess && onSaveSuccess();
      }}
    >
      <View
        className={styles.content}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {Drawer}
      </View>
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
