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
}

export interface User {
  nickname: string;
  avatarUrl: string;
}

interface State {
  recordList: IRecord[];
  user: User | null;
}

export const useCommonStore = create<State & Action>()(
  immer((set) => ({
    recordList: [],
    user: null,
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
