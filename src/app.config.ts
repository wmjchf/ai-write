export default defineAppConfig({
  pages: ["pages/index/index", "pages/result/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  appId: "wxdb1d8a9ef1ad7e95",
  plugins: {
    WechatSI: {
      version: "0.0.7",
      provider: "wx069ba97219f66d99",
    },
  },
});
