import { DEFAULT_SETTING } from "@/constant/data";
import Taro from "@tarojs/taro";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Action = {
  setRecordList: (recordList: IRecord[]) => void;
  setUser: (user: User) => void;
};

export interface IRecord {
  id: string;
  content: string;
  time: number;
  setting: User;
}

export interface User {
  nickname: string;
  showAvatar: boolean;
  showNick: boolean;
  avatarUrl: string;
  height: string;
  fontSize: string;
  x: string;
  y: string;
  fontWeight: number;
  showWater: boolean;
  backgroundImage: string;
  fontColor: number;
  customBackgroundImage: boolean;
  qrcodeUrl: string;
  customQRCodeUrl: boolean;
  typesetting: number;
}

interface State {
  recordList: IRecord[];
  user: User;
}

export const useCommonStore = create<State & Action>()(
  immer((set) => ({
    recordList: [],
    user: DEFAULT_SETTING,
    setRecordList: (recordList) =>
      set((state) => {
        state.recordList = recordList;
        Taro.setStorageSync("recordList", recordList);
      }),
    setUser: (user) => {
      set((state) => {
        state.user = user;
        Taro.setStorageSync("user", user);
      });
    },
  }))
);
