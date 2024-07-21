import { View, Image, Text } from "@tarojs/components";
import { useCommonStore } from "@/store";
import { useState } from "react";
import Taro from "@tarojs/taro";
import { CustomerHeader } from "@/components/Header";
import { IRecord } from "@/store/common";
import NoData from "./image/noData.png";
import { Item } from "./Item";
import { Poster } from "./Poster";

import styles from "./index.module.less";

export default function Result() {
  const { recordList, user } = useCommonStore();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<IRecord>();
  return (
    <View className={styles.result}>
      <CustomerHeader title="我的瞬间"></CustomerHeader>
      {recordList.length > 0 ? (
        <View className={styles.list}>
          {recordList.map((item) => {
            return (
              <Item
                data={item}
                key={item.id}
                onShare={(v) => {
                  if (!(item?.setting?.avatarUrl && item?.setting?.nickname)) {
                    Taro.showModal({
                      title: "理由",
                      content:
                        "在生成海报是需要您的头像和昵称信息，是否去填写？",
                      success(result) {
                        if (result.confirm) {
                          Taro.navigateTo({
                            url: `/pages/user/index?id=${item.id}`,
                          });
                        }
                      },
                    });
                    return;
                  }
                  setData(v);
                  setVisible(true);
                }}
              />
            );
          })}
        </View>
      ) : (
        <View className={styles.no__data}>
          <Image src={NoData} />
          <Text>没有数据</Text>
        </View>
      )}
      {visible && (
        <Poster
          data={data}
          onSaveSuccess={() => {
            setVisible(false);
          }}
        ></Poster>
      )}
    </View>
  );
}
