import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DataResponse = {
  id: string;
  [key: string]: string;
};
type DataList = Array<DataResponse>;

type DataResponseState = {
  dataList: DataList;
  setDataResponse: (
    id: string,
    key: "exampleResponse" | "errorExampleResponse",
    data: string,
  ) => void;
  deleteDataItem: (id: string) => void;
};

export const useDataStore = create<DataResponseState>()(
  persist(
    (set, get) => ({
      dataList: [],
      setDataResponse: (id, key, data) => {
        const _dataList = get().dataList;
        const index = _dataList.findIndex((item) => item?.id === id);
        if (index >= 0) {
          _dataList[index] = { ..._dataList[index], [key]: data };
          set({ dataList: [..._dataList] });
        } else
          set({
            dataList: [..._dataList, { id, [key]: data }],
          });
      },
      deleteDataItem: (id) => {
        const dataList = get().dataList;
        const index = dataList.findIndex((item) => item?.id === id);
        if (index >= 0) {
          dataList?.splice(index, 1);
          set({ dataList });
        }
      },
    }),
    {
      name: "data-storage",
      partialize: (state: DataResponseState) => ({
        dataList: state.dataList,
      }),
    },
  ),
);
