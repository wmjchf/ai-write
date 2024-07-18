import { getSetting } from "@/utils";
import { useCallback, useEffect, useState } from "react";

export const useHaveSetting = (setting: string) => {
  const [isHave, seIstHave] = useState(false);

  const handleGetSetting = useCallback(async () => {
    const result = await getSetting();
    seIstHave(result.authSetting[setting]);
  }, [setting]);

  useEffect(() => {
    handleGetSetting();
  }, [handleGetSetting]);

  return isHave;
};
