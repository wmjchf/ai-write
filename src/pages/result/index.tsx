import { View, Image, Text } from "@tarojs/components";
import { useCommonStore } from "@/store";
import { CustomerHeader } from "@/components/Header";

import NoData from "./image/noData.png";
import { Item } from "./Item";

import styles from "./index.module.less";

export default function Result() {
  const { recordList } = useCommonStore();
  return (
    <View className={styles.result}>
      <CustomerHeader title="我的瞬间"></CustomerHeader>
      {recordList.length > 0 ? (
        <View className={styles.list}>
          {recordList.map((item) => {
            return <Item data={item} key={item.id} />;
          })}
        </View>
      ) : (
        <View className={styles.no__data}>
          <Image src={NoData} />
          <Text>没有数据</Text>
        </View>
      )}
    </View>
  );
}
