import { View, Text } from "@tarojs/components";
import styles from "./index.module.less";

interface IModalProps {
  title?: string;
  content?: string;
}
export const Modal: React.FC<IModalProps> = (props) => {
  const { title, content } = props;
  return (
    <View className={styles.modal}>
      <View className={styles.modal__body}>
        <View className={styles.modal__body__title}>
          <Text>识别结果</Text>
        </View>
        <View className={styles.modal__body__content}>
          <Text>{content}</Text>
        </View>
      </View>
    </View>
  );
};
