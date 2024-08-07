import { View, Text } from "@tarojs/components";
import { IRecord, useCommonStore } from "@/store/common";
import classNames from "classnames";
import { AtSwipeAction } from "taro-ui";
import dayjs from "dayjs";
import Taro from "@tarojs/taro";
import styles from "./index.module.less";

interface IItem {
  data: IRecord;
  onShare?: (data: IRecord) => void;
}

export const Item: React.FC<IItem> = (props) => {
  const { data } = props;
  const { recordList, setRecordList } = useCommonStore();
  return (
    <AtSwipeAction
      className={styles.item}
      // autoClose={true}
      onClick={(event) => {
        if (event.id === "del") {
          Taro.showModal({
            title: "确认",
            content: "是否要删除，删除之后不可恢复！",
            success(result) {
              if (result.confirm) {
                const newList = recordList.filter(
                  (child) => child.id !== data.id
                );
                setRecordList(newList);
              }
            },
          });
        }
      }}
      options={[
        {
          text: "删除",
          style: {
            backgroundColor: "#FF4949",
          },
          id: "del",
        },
      ]}
    >
      <View
        className={classNames(styles.container)}
        onClick={(event) => {
          event.stopPropagation();
          Taro.navigateTo({
            url: `/pages/detail/index?id=${data.id}`,
          });
        }}
      >
        <View className={styles.top}>
          <View className={styles.time}>
            <Text>时间：</Text>
            <Text>{dayjs(data.time).format("YYYY-MM-DD HH:mm:ss")}</Text>
          </View>
        </View>
        <View className={styles.bottom}>
          <Text>{data.content}</Text>
        </View>
      </View>
    </AtSwipeAction>
    // <View
    //   className={classNames(styles.item)}
    // onClick={() => {
    //   Taro.navigateTo({
    //     url: `/pages/detail/index?id=${data.id}`,
    //   });
    // }}
    // >
    //   <View className={styles.container}>
    //     <View className={styles.top}>
    //       <View className={styles.time}>
    //         <Text>时间：</Text>
    //         <Text>{dayjs(data.time).format("YYYY-MM-DD HH:mm:ss")}</Text>
    //       </View>
    //       <View
    //         className={styles.setting}
    //         onClick={(event) => {
    //           event.stopPropagation();
    //           Taro.showModal({
    //             title: "确认",
    //             content: "是否要删除，删除之后不可恢复！",
    //             success(result) {
    //               if (result.confirm) {
    //                 const newList = recordList.filter(
    //                   (child) => child.id !== data.id
    //                 );
    //                 setRecordList(newList);
    //               }
    //             },
    //           });
    //         }}
    //       >
    //         <Image src={DeletePng}></Image>
    //       </View>
    //     </View>
    //     <View className={styles.bottom}>
    //       <Text>{data.content}</Text>
    //     </View>
    //     {/* <View className={styles.operation}>
    //       <View
    //         className={styles.delete}
    //         onClick={() => {
    //           Taro.showModal({
    //             title: "确认",
    //             content: "是否要删除，删除之后不可恢复！",
    //             success(result) {
    //               if (result.confirm) {
    //                 const newList = recordList.filter(
    //                   (child) => child.id !== data.id
    //                 );
    //                 setRecordList(newList);
    //               }
    //             },
    //           });
    //         }}
    //       >
    //         <Image src={DeletePng} />
    //         <Text>删除</Text>
    //       </View>
    //       <View
    //         className={styles.share}
    //         onClick={() => {
    //           onShare && onShare(data);
    //         }}
    //       >
    //         <Image src={SharePng} />
    //         <Text>分享</Text>
    //       </View>
    //       <View
    //         className={styles.setting}
    //         onClick={() => {
    //           Taro.navigateTo({
    //             url: `/pages/user/index?id=${data.id}`,
    //           });
    //         }}
    //       >
    //         <Image src={SettingPng} />
    //         <Text>自定义</Text>
    //       </View>
    //     </View> */}
    //   </View>
    // </View>
  );
};
