import Taro from "@tarojs/taro";

export const getSetting: () => Promise<Taro.getSetting.SuccessCallbackResult> =
  () => {
    return new Promise(function (resolve, reject) {
      Taro.getSetting({
        success(result) {
          resolve(result);
        },
        fail(error) {
          reject(error);
        },
      });
    });
  };

export const authorize: (scope: string) => Promise<boolean> = (
  scope: string
) => {
  return new Promise((resolve, reject) => {
    Taro.authorize({
      scope,
      success() {
        resolve(true);
      },
      fail(error) {
        reject(error);
      },
    });
  });
};

export const openSetting: () => Promise<Taro.openSetting.SuccessCallbackResult> =
  () => {
    return new Promise((resolve, reject) => {
      Taro.openSetting({
        success(result) {
          resolve(result);
        },
        fail(error) {
          reject(error);
        },
      });
    });
  };

export const handleAuth = async (scope: string, tip?: string) => {
  try {
    const setting = await getSetting();
    const recordSetting = setting.authSetting[scope];
    if (!recordSetting) {
      const result = await authorize(scope);
      if (result) {
        return true;
      }
      return false;
    }
    return true;
  } catch (error) {
    if (error.errMsg === "authorize:fail auth deny") {
      Taro.showModal({
        title: "授权",
        content: tip || "要使用语音转文字功能，需要打开麦克风权限！",
        success(result) {
          if (result.confirm) {
            Taro.openSetting();
          }
        },
      });
    }
  }
};
