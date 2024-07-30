import { View, Text } from "@tarojs/components";
import { CustomerHeader } from "@/components/Header";
import styles from "./index.module.less";

const Privary = () => {
  return (
    <View className={styles.privary}>
      <CustomerHeader title="隐私政策"></CustomerHeader>
      <View className={styles.title}>音瞬小程序隐私保护指引</View>
      <View className={styles.content}>
        <Text>1. 开发者处理的信息</Text>
        <Text>
          根据法律规定，开发者仅处理实现小程序功能所必要的信息。{"\n"}
          {"\n"}
          为了下载分享海报，开发者将在获取你的明示同意后，使用你的相册（仅写入）权限。
          {"\n"}
          {"\n"}
          为了将语音转成文字，开发者将在获取你的明示同意后，访问你的麦克风。
        </Text>
      </View>

      <View className={styles.content}>
        <Text>2. 第三方插件信息/SDK信息</Text>
        <Text>
          为实现特定功能，开发者可能会接入由第三方提供的插件/SDK。第三方插件/SDK的个人信息处理规则，请以其公示的官方说明为准。音瞬小程序接入的第三方插件信息/SDK信息如下：
          {"\n"}
          {"\n"}
          插件名称：微信同声传译 {"\n"}
          {"\n"}插件提供方名称: 深圳市腾讯计算机系统有限公司
        </Text>
      </View>
      <View className={styles.content}>
        <Text>3. 你的权益</Text>
        <Text>
          3.1
          关于使用你的相册（仅写入）权限、访问你的麦克风，你可以通过以下路径：小程序主页右上角“…”—“设置”—点击特定信息—点击“不允许”，撤回对开发者的授权。
          {"\n"}
          {"\n"}
          3.2
          关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。{" "}
          {"\n"}
          {"\n"}
          3.3
          若你在小程序中注册了账号，你可以通过以下方式与开发者联系，申请注销你在小程序中使用的账号。在受理你的申请后，开发者承诺在十五个工作日内完成核查和处理，并按照法律法规要求处理你的相关信息。
          {"\n"}
          {"\n"}
          微信号:wmj3284304056
        </Text>
      </View>
      <View className={styles.content}>
        <Text>4. 开发者对信息的存储</Text>
        <Text>
          4.1
          开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。
        </Text>
      </View>
      <View className={styles.content}>
        <Text>5. 信息的使用规则</Text>
        <Text>
          5.1 开发者将会在本指引所明示的用途内使用收集的信息
          {"\n"}
          {"\n"}
          5.2
          如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以弹框公告方式告知并征得你的明示同意。
        </Text>
      </View>
      <View className={styles.content}>
        <Text>6. 信息对外提供</Text>
        <Text>
          6.1
          开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。
          {"\n"}
          {"\n"}
          6.2
          开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
        </Text>
      </View>
      <View className={styles.content}>
        <Text>
          7.
          你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系；或者向微信进行投诉。
        </Text>
      </View>
    </View>
  );
};

export default Privary;
