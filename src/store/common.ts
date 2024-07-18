import Taro from "@tarojs/taro";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Action = {
  setRecordList: (recordList: IRecord[]) => void;
};

export interface IRecord {
  id: number;
  content: string;
  time: number;
}

interface State {
  recordList: IRecord[];
}

export const useCommonStore = create<State & Action>()(
  immer((set) => ({
    recordList: [],
    setRecordList: (recordList) =>
      set((state) => {
        state.recordList = recordList;
        Taro.setStorageSync("recordList", recordList);
      }),
  }))
);
