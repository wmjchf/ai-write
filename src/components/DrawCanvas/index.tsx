import { Canvas } from "@tarojs/components";
import Taro, { CanvasContext } from "@tarojs/taro";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IConfig, IIMage } from "./type";

import { downloadImageAndInfo, getHeight } from "./utils/tools";
import {
  drawBlock,
  drawImage,
  drawLine,
  drawQrcode,
  drawText,
} from "./utils/draw";

interface IDrawCanvas {
  config: IConfig;
  onCreateSuccess: (res: any) => void;
  onCreateFail: (err: any) => void;
  onLoad?: () => void;
}
let count = 1;
export const DrawCanvas: React.FC<IDrawCanvas> = (props) => {
  const { config, onCreateFail, onCreateSuccess, onLoad } = props;

  const [debug] = useState(config.debug);
  const [factor] = useState(config.factor);
  const [pixelRatio] = useState(config.pixelRatio || 1);
  const drawArrRef = useRef<any[]>([]);
  const ctxRef = useRef<any>();

  const toPx = useCallback(
    (rpx: number, int: boolean = false, _factor: number = factor) => {
      if (int) {
        return Math.ceil(rpx * factor * pixelRatio);
      }
      return rpx * _factor * pixelRatio;
    },
    [factor, pixelRatio]
  );

  const toRpx = useCallback(
    (px: number, int: boolean = false, _factor: number = factor) => {
      if (int) {
        return Math.ceil(px / _factor);
      }
      return px / _factor;
    },
    [factor]
  );

  const [pxWidth] = useState(toPx(config.width));
  const [pxHeight] = useState(toPx(getHeight(config)));

  const _downloadImageAndInfo = useCallback(
    (image: IIMage, index: number, _pixelRatio: number) => {
      return new Promise<any>((resolve, reject) => {
        downloadImageAndInfo(image, index, toRpx, _pixelRatio)
          .then((result) => {
            drawArrRef.current.push(result);
            resolve(result);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    [toRpx]
  );

  const downloadResource = useCallback(
    ({
      images = [],
      _pixelRatio = 1,
    }: {
      images: IIMage[];
      _pixelRatio: number;
    }) => {
      const drawList: any[] = [];
      let imagesTemp = images;

      imagesTemp.forEach((image, index) =>
        drawList.push(_downloadImageAndInfo(image, index, _pixelRatio))
      );

      return Promise.all(drawList);
    },
    [_downloadImageAndInfo]
  );
  const downloadResourceTransit = useCallback(() => {
    return new Promise<any>((resolve, reject) => {
      if (config.images && config.images.length > 0) {
        downloadResource({
          images: config.images,
          _pixelRatio: config.pixelRatio || 1,
        })
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            // console.log(e);
            reject(e);
          });
      } else {
        setTimeout(() => {
          resolve(1);
        }, 500);
      }
    });
  }, [config, downloadResource]);
  const getTempFile = useCallback(
    (otherOptions) => {
      Taro.canvasToTempFilePath({
        canvasId: config.canvasId,
        quality: 1,
        success: (result) => {
          if (!onCreateSuccess) {
            console.warn(
              "您必须实现 taro-plugin-canvas 组件的 onCreateSuccess 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#success"
            );
          }
          onCreateSuccess && onCreateSuccess(result);
          config.hideLoading === false && Taro.hideLoading();
        },
        fail: (error) => {
          const { errMsg } = error;
          console.log(errMsg);
          if (errMsg === "canvasToTempFilePath:fail:create bitmap failed") {
            count += 1;
            if (count <= 3) {
              getTempFile(otherOptions);
            } else {
              if (!onCreateFail) {
                console.warn(
                  "您必须实现 taro-plugin-canvas 组件的 onCreateFail 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#fail"
                );
              }
              onCreateFail && onCreateFail(error);
              config.hideLoading === false && Taro.hideLoading();
            }
          }
        },
      });
    },
    [config, onCreateSuccess, onCreateFail]
  );
  const create = useCallback(() => {
    ctxRef.current = Taro.createCanvasContext(config.canvasId);
    const height = getHeight(config);
    // 设置 pixelRatio
    // 设置画布底色
    if (config.backgroundColor) {
      ctxRef.current!.save();
      ctxRef.current!.setFillStyle(config.backgroundColor);
      ctxRef.current!.fillRect(0, 0, toPx(config.width), toPx(height));
      ctxRef.current!.restore();
    }
    const {
      texts = [],
      // images = [],
      qrcodes = [],
      blocks = [],
      lines = [],
    } = config;
    const queue = drawArrRef.current
      .concat(
        texts.map((item) => {
          item.type = "text";
          item.zIndex = item.zIndex || 0;
          return item;
        })
      )
      .concat(
        blocks.map((item) => {
          item.type = "block";
          item.zIndex = item.zIndex || 0;
          return item;
        })
      )
      .concat(
        lines.map((item) => {
          item.type = "line";
          item.zIndex = item.zIndex || 0;
          return item;
        })
      )
      .concat(
        qrcodes.map((item) => {
          item.type = "qrcode";
          item.zIndex = item.zIndex || 0;
          return item;
        })
      );

    // 按照顺序排序
    queue.sort((a, b) => a.zIndex - b.zIndex);
    let drawOptions = {
      ctx: ctxRef.current as CanvasContext,
      canvasId: config.canvasId,
      toPx: toPx,
      toRpx: toRpx,
      pxWidth,
      pxHeight,
    };
    queue.forEach((item) => {
      if (item.type === "image") {
        if (drawOptions.ctx !== null) {
          drawImage(item, drawOptions);
        }
      } else if (item.type === "text") {
        if (drawOptions.ctx !== null) {
          drawText(item, drawOptions);
        }
      } else if (item.type === "block") {
        if (drawOptions.ctx !== null) {
          drawBlock(item, drawOptions);
        }
      } else if (item.type === "line") {
        if (drawOptions.ctx !== null) {
          drawLine(item, drawOptions);
        }
      } else if (item.type === "qrcode") {
        drawQrcode(item, drawOptions);
      }
    });

    // const res = Taro.getSystemInfoSync();
    // const platform = res.platform;
    let time = 1000;
    // if (platform === "android") {
    // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
    // time = 1000;
    // }
    ctxRef.current!.draw(false, () => {
      setTimeout(() => {
        getTempFile(null);
      }, time);
    });
  }, [config, getTempFile, toPx, toRpx]);

  const onCreate = useCallback(() => {
    return downloadResourceTransit()
      .then(() => {
        onLoad && onLoad();
        create();
      })
      .catch((err) => {
        config.hideLoading === false && Taro.hideLoading();
        Taro.showToast({ icon: "none", title: err.errMsg || "下载图片失败" });
        console.error(err);
        if (!onCreateFail) {
          console.warn(
            "您必须实现 taro-plugin-canvas 组件的 onCreateFail 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#fail"
          );
        }
        onCreateFail && onCreateFail(err);
      });
  }, [config, onCreateFail, create, downloadResourceTransit, onLoad]);

  useEffect(() => {
    if (config.hideLoading === false) {
      Taro.showLoading({ mask: true, title: "生成中..." });
    }
    onCreate();
  }, [onCreate, config]);

  if (pxWidth && pxHeight) {
    return (
      <Canvas
        canvasId={config.canvasId}
        style={`width:${pxWidth}px; height:${pxHeight}px;`}
        className={`${debug ? "debug" : "pro"} canvas`}
      />
    );
  }
  return <></>;
};
