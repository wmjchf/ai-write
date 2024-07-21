import {
  View,
  Image,
  Text,
  Button,
  Input,
  Picker,
  Switch,
} from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useCommonStore } from "@/store";
import { IRecord } from "@/store/common";
import { CustomerHeader } from "@/components/Header";
import { WEIGHT_OPTION } from "@/constant/data";
import AvatarPng from "./image/avatar.png";
import styles from "./index.module.less";

export default function User() {
  const { setUser, user, recordList, setRecordList } = useCommonStore();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nickname, setNickname] = useState("");
  const [height, setHeight] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [weight, setWeight] = useState(0);
  const [id, setId] = useState("");

  useLoad((option) => {
    setId(option.id);
  });

  useEffect(() => {
    if (!id) {
      setNickname(user?.nickname);
      setAvatarUrl(user?.avatarUrl);
      setHeight(user?.height);
      setFontSize(user?.fontSize);
      setX(user.x);
      setY(user.y);
      setWeight(user.fontWeight);
      return;
    }

    const record = recordList.find((item) => item.id === id) as IRecord;
    setNickname(record?.setting?.nickname);
    setAvatarUrl(record?.setting?.avatarUrl);
    setHeight(record?.setting?.height);
    setFontSize(record?.setting?.fontSize);
    setX(record?.setting?.x);
    setY(record?.setting?.y);
    setWeight(record?.setting?.fontWeight);
  }, [user, id, recordList]);

  useEffect(() => {}, []);

  return (
    <View className={styles.user}>
      <CustomerHeader title="设置"></CustomerHeader>
      <View className={styles.container}>
        <View className={styles.content}>
          <View className={styles.item}>
            <Text>头像</Text>
            <View className={styles.right}>
              <Button
                className={styles.choose__avatar}
                openType="chooseAvatar"
                onChooseAvatar={(event) => {
                  setAvatarUrl(event.detail.avatarUrl);
                }}
              >
                <Image src={avatarUrl || AvatarPng}></Image>
              </Button>
            </View>
          </View>
          <View className={styles.item}>
            <Text>昵称</Text>
            <View className={styles.right}>
              <Input
                className={styles.nickname}
                type="nickname"
                placeholder="输入用户昵称"
                value={nickname}
                onInput={(event) => {
                  setNickname(event.detail.value);
                }}
              />
            </View>
          </View>
          {/* <View className={styles.item}>
            <Text>自定义画布高度</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入画布高度"
                className={styles.height}
                value={height}
                onInput={(event) => {
                  setHeight(event.detail.value);
                }}
              />
            </View>
          </View> */}
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>自定义文字位置x</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入位置x"
                className={styles.height}
                value={x}
                onInput={(event) => {
                  setX(event.detail.value);
                }}
                disabled
              />
            </View>
          </View>
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>自定义文字位置y</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入位置y"
                className={styles.height}
                value={y}
                disabled
                onInput={(event) => {
                  setY(event.detail.value);
                }}
              />
            </View>
          </View>
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>自定义文字粗细</Text>
            <View className={styles.right}>
              <Picker
                className={styles.height}
                value={weight}
                rangeKey="label"
                range={WEIGHT_OPTION}
                disabled
                onChange={(event) => {
                  setWeight(parseInt(event.detail.value as string));
                }}
              >
                {WEIGHT_OPTION[weight]?.label || "请选择"}
              </Picker>
            </View>
          </View>
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>自定义字体大小</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入字体大小"
                className={styles.height}
                disabled
                value={fontSize}
                onInput={(event) => {
                  setFontSize(event.detail.value);
                }}
              />
            </View>
          </View>
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>是否自定义文字颜色</Text>
            <View className={styles.right}>
              <Switch disabled></Switch>
            </View>
          </View>
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>是否自定义背景</Text>
            <View className={styles.right}>
              <Switch disabled></Switch>
            </View>
          </View>
          <View className={classNames(styles.item, styles.disabled)}>
            <Text>是否自定义二维码</Text>
            <View className={styles.right}>
              <Switch disabled></Switch>
            </View>
          </View>
        </View>
        <View className={styles.btn}>
          <Button
            className={styles.save}
            onClick={() => {
              if (nickname && avatarUrl) {
                if (!id) {
                  // 全局设置
                  setUser({
                    nickname,
                    avatarUrl,
                    height,
                    fontSize,
                    x,
                    y,
                    fontWeight: weight,
                  });
                } else {
                  const newRecordList = recordList.map((item) => {
                    if (item.id === id) {
                      return {
                        ...item,
                        setting: {
                          nickname,
                          avatarUrl,
                          height,
                          fontSize,
                          x,
                          y,
                          fontWeight: weight,
                        },
                      };
                    }
                    return item;
                  });
                  setRecordList(newRecordList);
                }
                Taro.navigateBack();
              } else {
                Taro.showToast({
                  title: "用户信息需要填写完整！",
                });
              }
            }}
          >
            保存
          </Button>
          <View className={styles.tip}>
            <Text>
              说明：目前之有头像和昵称可以自定义，后续会慢慢放开分更多自定义功能
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
