import { View, Text } from "@tarojs/components";
import styles from "./index.module.less";

interface IPopupProps {
  title?: string;
  children?:React.ReactNode
  open?:boolean;
  height?:number,
  onClose?:()=>void
}
export const Popup: React.FC<IPopupProps> = (props) => {
  const { children,open = false, title,height,onClose } = props;
  if(!open){
    return <></>
  }
  return (
    <View className={styles.popup}>
      <View className={styles.popup__mask} onClick={()=>{
        onClose && onClose()
      }}
      ></View>
      <View className={styles.popup__body}>
        {
          title&&<View className={styles.popup__body__title}>
            <Text>{title}</Text>
          </View>
        }
        <View className={styles.popup__body__content} style={{height}}>
          {children}
        </View>
      </View>
    </View>
  );
};
