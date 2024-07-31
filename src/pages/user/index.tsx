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
import { AtImagePicker } from "taro-ui";
import classNames from "classnames";
import { File } from "taro-ui/types/image-picker";
import { useEffect, useState } from "react";
import { useCommonStore } from "@/store";
import { IRecord } from "@/store/common";
import { CustomerHeader } from "@/components/Header";
import {
  COLOR_OPTION,
  DEFAULT_SETTING,
  TYPESETTING_OPTION,
  WEIGHT_OPTION,
} from "@/constant/data";
import RightPng from "./image/right.png";
import styles from "./index.module.less";

export default function User() {
  const { setUser, user, recordList, setRecordList } = useCommonStore();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatar, setShowAvatar] = useState(DEFAULT_SETTING.showAvatar);
  const [nickname, setNickname] = useState("");
  const [height, setHeight] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [weight, setWeight] = useState(0);
  const [typesetting, setTypesetting] = useState(0);
  const [id, setId] = useState("");

  const [showWater, setShowWater] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<File[]>([]);
  const [customBackgroundImage, setCustomBackgroundImage] = useState(false);
  const [fontColor, setFontColor] = useState(0);
  const [qrcodeUrl, setQRCodeUrl] = useState<File[]>([]);
  const [customQRCodeUrl, setCustomQRCodeUrl] = useState(false);
  const [showNick, setShowNick] = useState(DEFAULT_SETTING.showNick);

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
      setShowWater(user.showWater);
      user?.backgroundImage &&
        setBackgroundImage([{ url: user?.backgroundImage }]);
      user?.qrcodeUrl && setQRCodeUrl([{ url: user?.qrcodeUrl }]);
      setCustomBackgroundImage(user?.customBackgroundImage);
      setCustomQRCodeUrl(user?.customQRCodeUrl);
      setFontColor(user?.fontColor);

      return;
    }

    const record = recordList.find((item) => item.id === id) as IRecord;
    setNickname(record?.setting?.nickname || DEFAULT_SETTING.nickname);
    setAvatarUrl(record?.setting?.avatarUrl || DEFAULT_SETTING.avatarUrl);
    setHeight(record?.setting?.height || DEFAULT_SETTING.height);
    setFontSize(record?.setting?.fontSize || DEFAULT_SETTING.fontSize);
    setX(record?.setting?.x || DEFAULT_SETTING.x);
    setY(record?.setting?.y || DEFAULT_SETTING.y);
    setWeight(record?.setting?.fontWeight || DEFAULT_SETTING.fontWeight);
    setTypesetting(record?.setting?.typesetting || DEFAULT_SETTING.typesetting);
    setShowWater(record?.setting?.showWater);
    setShowAvatar(
      record?.setting?.showAvatar === undefined
        ? DEFAULT_SETTING.showAvatar
        : record?.setting?.showAvatar
    );
    setShowNick(
      record?.setting?.showNick === undefined
        ? DEFAULT_SETTING.showNick
        : record?.setting?.showNick
    );
    setBackgroundImage([
      {
        url:
          record?.setting?.backgroundImage || DEFAULT_SETTING.backgroundImage,
      },
    ]);

    setQRCodeUrl([
      { url: record?.setting?.qrcodeUrl || DEFAULT_SETTING.qrcodeUrl },
    ]);
    setCustomBackgroundImage(
      record?.setting?.customBackgroundImage ||
        DEFAULT_SETTING.customBackgroundImage
    );
    setCustomQRCodeUrl(
      record?.setting?.customQRCodeUrl || DEFAULT_SETTING.customQRCodeUrl
    );
    setFontColor(
      record?.setting?.fontColor == null
        ? DEFAULT_SETTING.fontColor
        : record?.setting?.fontColor
    );
  }, [user, id, recordList]);

  useEffect(() => {}, []);

  return (
    <View className={styles.user}>
      <CustomerHeader title="自定义分享"></CustomerHeader>
      <View className={styles.container}>
        <View className={styles.content}>
          {/* <View className={classNames(styles.item, showAvatar && styles.col)}>
            <View className={classNames(styles.item__wrap)}>
              <Text>头像</Text>
              <View className={styles.right}>
                <Switch
                  checked={showAvatar}
                  onChange={(event) => {
                    setShowAvatar(event.detail.value);
                  }}
                ></Switch>
              </View>
            </View>
            <View
              className={classNames(
                styles.item__content,
                !showAvatar && styles.hidden,
                styles.avatar
              )}
            >
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
          </View> */}
          <View className={classNames(styles.item)}>
            <Text>昵称</Text>
            <View className={styles.right}>
              <Input
                className={styles.nickname__input}
                type="nickname"
                placeholder="输入用户昵称"
                value={nickname}
                onInput={(event) => {
                  setNickname(event.detail.value);
                }}
              />
              <Image src={RightPng} className={styles.rightIcon} />
            </View>
          </View>

          {/* <View className={styles.item}>
            <Text>是否显示音瞬水印</Text>
            <View className={styles.right}>
              <Switch
                checked={showWater}
                onChange={(event) => {
                  setShowWater(event.detail.value);
                }}
              ></Switch>
            </View>
          </View> */}
          <View
            className={classNames(
              styles.item,
              customBackgroundImage && styles.col
            )}
          >
            <View className={classNames(styles.item__wrap)}>
              <Text>自定义背景</Text>
              <View className={styles.right}>
                <Switch
                  checked={customBackgroundImage}
                  onChange={(event) => {
                    setCustomBackgroundImage(event.detail.value);
                  }}
                ></Switch>
              </View>
            </View>
            <View
              className={classNames(
                styles.item__content,
                !customBackgroundImage && styles.hidden
              )}
            >
              <AtImagePicker
                files={backgroundImage}
                count={1}
                multiple={false}
                showAddBtn={backgroundImage.length !== 1}
                onChange={(event) => {
                  setBackgroundImage(event);
                }}
                length={1}
              />
            </View>
          </View>
          <View className={classNames(styles.item)}>
            <Text>自定义文字颜色</Text>
            <View className={styles.right}>
              <Picker
                className={styles.height}
                value={fontColor}
                rangeKey="label"
                range={COLOR_OPTION}
                onChange={(event) => {
                  setFontColor(parseInt(event.detail.value as string));
                }}
              >
                {COLOR_OPTION[fontColor]?.label || "请选择"}
              </Picker>
              <Image
                src={RightPng}
                className={classNames(
                  styles.rightIcon,
                  styles.right__icon__picker
                )}
              />
            </View>
          </View>
          {/* <View
            className={classNames(
              styles.item,
              styles.disabled,
              customQRCodeUrl && styles.col
            )}
          >
            <View className={classNames(styles.item__wrap)}>
              <Text>自定义二维码</Text>
              <View className={styles.right}>
                <Switch
                  checked={customQRCodeUrl}
                  disabled
                  onChange={(event) => {
                    setCustomQRCodeUrl(event.detail.value);
                  }}
                ></Switch>
              </View>
            </View>
            <View
              className={classNames(
                styles.item__content,
                !customQRCodeUrl && styles.hidden,
                styles.qrcode
              )}
            >
              <AtImagePicker
                files={qrcodeUrl}
                count={1}
                multiple={false}
                showAddBtn={qrcodeUrl.length !== 1}
                onChange={(event) => {
                  setQRCodeUrl(event);
                }}
                length={1}
              />
            </View>
          </View> */}

          {/* <View className={classNames(styles.item, styles.disabled)}>
            <Text>是否自定义二维码</Text>
            <View className={styles.right}>
              <Switch disabled></Switch>
            </View>
          </View> */}
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
          {/* <View className={classNames(styles.item)}>
            <Text>自定义文字位置x</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入位置x"
                className={styles.height}
                value={x}
                onInput={(event) => {
                  setX(event.detail.value);
                }}
              />
            </View>
          </View>
          <View className={classNames(styles.item)}>
            <Text>自定义文字位置y</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入位置y"
                className={styles.height}
                value={y}
                onInput={(event) => {
                  setY(event.detail.value);
                }}
              />
            </View>
          </View> */}
          <View className={classNames(styles.item)}>
            <Text>自定义文字粗细</Text>
            <View className={styles.right}>
              <Picker
                className={styles.height}
                value={weight}
                rangeKey="label"
                range={WEIGHT_OPTION}
                onChange={(event) => {
                  setWeight(parseInt(event.detail.value as string));
                }}
              >
                {WEIGHT_OPTION[weight]?.label || "请选择"}
              </Picker>
              <Image
                src={RightPng}
                className={classNames(
                  styles.rightIcon,
                  styles.right__icon__picker
                )}
              />
            </View>
          </View>
          {/* <View className={classNames(styles.item)}>
            <Text>自定义字体大小</Text>
            <View className={styles.right}>
              <Input
                placeholder="请输入字体大小"
                className={styles.height}
                value={fontSize}
                onInput={(event) => {
                  setFontSize(event.detail.value);
                }}
              />
            </View>
          </View> */}
          <View className={classNames(styles.item)}>
            <Text>文字排版</Text>
            <View className={styles.right}>
              <Picker
                className={styles.height}
                value={typesetting}
                rangeKey="label"
                range={TYPESETTING_OPTION}
                onChange={(event) => {
                  setTypesetting(parseInt(event.detail.value as string));
                }}
              >
                {TYPESETTING_OPTION[typesetting]?.label || "请选择"}
              </Picker>
              <Image
                src={RightPng}
                className={classNames(
                  styles.rightIcon,
                  styles.right__icon__picker
                )}
              />
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
                    showWater,
                    backgroundImage: backgroundImage[0]?.url || "",
                    fontColor,
                    customBackgroundImage,
                    qrcodeUrl: qrcodeUrl[0]?.url || "",
                    customQRCodeUrl,
                    showAvatar,
                    showNick,
                    typesetting,
                  });
                } else {
                  if (customBackgroundImage && !backgroundImage[0]?.url) {
                    Taro.showToast({
                      title: "请上传背景图片",
                      icon: "error",
                    });
                    return;
                  }
                  if (customQRCodeUrl && !qrcodeUrl[0]?.url) {
                    Taro.showToast({
                      title: "请二维码图片",
                      icon: "error",
                    });
                    return;
                  }
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
                          showWater,
                          backgroundImage: backgroundImage[0]?.url || "",
                          fontColor,
                          customBackgroundImage,
                          qrcodeUrl: qrcodeUrl[0]?.url || "",
                          customQRCodeUrl,
                          showAvatar,
                          showNick,
                          typesetting,
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
          {/* <View className={styles.tip}>
            <Text>
              说明：目前只有部分可以自定义，后续会慢慢放开分更多自定义功能！
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
}
