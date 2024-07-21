import { View, Image, Text, Button, Input, Switch } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { useCommonStore } from "@/store";
import { CustomerHeader } from "@/components/Header";
import AvatarPng from "./image/avatar.png";
import styles from "./index.module.less";

export default function User() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nickname, setNickname] = useState("");

  const { setUser, user } = useCommonStore();

  useEffect(() => {
    if (user) {
      setNickname(user?.nickname);
      setAvatarUrl(user?.avatarUrl);
    }
  }, [user]);

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
          <View className={styles.item}>
            <Text>是否自定义文字颜色</Text>
            <View className={styles.right}>
              <Text className={styles.disabled}>未开放</Text>
            </View>
          </View>
          <View className={styles.item}>
            <Text>是否自定义背景</Text>
            <View className={styles.right}>
              <Text className={styles.disabled}>未开放</Text>
            </View>
          </View>
          <View className={styles.item}>
            <Text>是否自定义二维码</Text>
            <View className={styles.right}>
              <Text className={styles.disabled}>未开放</Text>
            </View>
          </View>
        </View>
        <View className={styles.btn}>
          <Button
            className={styles.save}
            onClick={() => {
              if (nickname && avatarUrl) {
                setUser({
                  nickname,
                  avatarUrl,
                });
                Taro.navigateBack();
              } else {
                // setUser({
                //   nickname: "Ming",
                //   avatarUrl,
                // });
                // Taro.navigateBack();
                Taro.showToast({
                  title: "用户信息需要填写完整！",
                });
              }
            }}
          >
            保存
          </Button>
          {/* <View className={styles.tip}>
            <Text>
              说明：头像、用户昵称只用于生成分享海报使用，同时只会保存在本地。
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
}
