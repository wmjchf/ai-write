import { useMemo, useState } from "react";
import { View } from "@tarojs/components";
import { useDidShow, useLoad } from "@tarojs/taro";
import { useCommonStore } from "@/store";
import { CustomerHeader } from "@/components/Header";
import { IRecord } from "@/store/common";
import { Poster } from "../result/Poster";

import styles from "./index.module.less";

const Detail = () => {
  const [id, setId] = useState("");
  const { recordList } = useCommonStore();
  const [data, setData] = useState<IRecord>();
  const [loading, setLoading] = useState(true);

  useLoad((option) => {
    setId(option.id);
  });

  useDidShow(() => {
    if (id) {
      const record = recordList.find((item) => item.id === id);
      setData(record);
    }
  });

  //   useEffect(() => {
  //     if (id) {
  //       const record = recordList.find((item) => item.id === id);
  //       setData(record);
  //     }
  //   }, [id, recordList]);

  const Canvas = useMemo(() => {
    if (data) {
      return (
        <Poster
          data={data}
          onLoad={() => {
            setLoading(false);
          }}
        ></Poster>
      );
    }
  }, [data]);

  return (
    <View className={styles.detail}>
      <CustomerHeader title="分享"></CustomerHeader>
      {Canvas}
      {!loading && (
        <View className={styles.setting}>
          {/* <Text>自定义：</Text>
          <View
            className={styles.item}
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/user/index?id=${data?.id}`,
              });
            }}
          >
            <Image src={ContentPng} />
            <Text>内容</Text>
          </View>
          <View className={styles.item}>
            <Image src={StylePng} />
            <Text>样式</Text>
          </View> */}
        </View>
      )}
    </View>
  );
};

export default Detail;
