import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import BackPng from "./image/back.png";
import "./index.less";

interface CustomerHeaderProps {
  /**
   * 非必填 左边节点
   * */
  backNode?: React.ReactNode | string;

  /**
   * 标题
   * */
  title?: React.ReactNode | string;

  /**
   * 图标
   * */
  Icon?: string;
  /**
   * 定位
   * */
  position?: "relative" | "absolute";
  /**
   * 背景
   * */
  background?: string;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = (
  props: CustomerHeaderProps
) => {
  const globalData: any = {};
  const { backNode, title, position = "relative", background = "#fff" } = props;

  const [navbarHeight, setnavbarHeight] = useState<number>(0); // 顶部导航栏高度
  const [cusnavH, setcusnavH] = useState<number>(0);
  const [statusBarHeight, setstatusBarHeight] = useState<number>(0);
  // console.log(navbarBtn);
  useEffect(() => {
    globalData.systeminfo = Taro.getSystemInfoSync();
    if (!globalData.headerBtnPosi)
      globalData.headerBtnPosi = Taro.getMenuButtonBoundingClientRect();
    let newstatusBarHeight = globalData.systeminfo.statusBarHeight; // 状态栏高度
    let headerPosi = globalData.headerBtnPosi; // 胶囊位置信息
    let btnPosi = {
      // 胶囊实际位置，坐标信息不是左上角原点
      height: headerPosi.height,
      width: headerPosi.width,
      top: headerPosi.top - newstatusBarHeight, // 胶囊top - 状态栏高度
      bottom: headerPosi.bottom - headerPosi.height - newstatusBarHeight, // 胶囊bottom - 胶囊height - 状态栏height （胶囊实际bottom 为距离导航栏底部的长度）
      right: globalData.systeminfo.windowWidth - headerPosi.right, // 这里不能获取 屏幕宽度，PC端打开小程序会有BUG，要获取窗口高度 - 胶囊right
    };

    const newcusnavH = btnPosi.height + btnPosi.top + btnPosi.bottom; // 导航高度
    const newnavbarHeight = headerPosi.bottom + btnPosi.bottom; // 胶囊bottom + 胶囊实际bottom
    setnavbarHeight(newnavbarHeight);
    setcusnavH(newcusnavH);
    setstatusBarHeight(newstatusBarHeight);
  }, []);

  const back = () => {
    Taro.navigateBack();
  };
  return (
    <View className="custom_nav" style={{ position, background }}>
      <View className="custom_nav_box" style={{ height: `${navbarHeight}px` }}>
        <View
          className="custom_nav_bar"
          style={{
            top: `${statusBarHeight}px`,
            height: `${cusnavH}px`,
            lineHeight: `${cusnavH}px`,
          }}
        >
          <View className="nav_warp">
            {backNode ? (
              backNode
            ) : (
              <Image className="icon" src={BackPng} onClick={back} />
            )}
            <View className="title">{title}</View>
          </View>
        </View>
      </View>
    </View>
  );
};
