import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
};

export const useFetchedDataStore = create<DataResponseState>()(
  devtools(
    persist(
      (set, get) => ({
        dataList: [],
        setDataResponse: (id, key, data) => {
          const _dataList = get().dataList;
          const index = _dataList.findIndex((item) => item?.id === id);
          if (index >= 0) {
            _dataList[index] = { ..._dataList[index], [key]: data };
            set(
              { dataList: [..._dataList] },
              false,
              "useFetchedDataStore/setDataResponse",
            );
          } else
            set(
              {
                dataList: [..._dataList, { id, [key]: data }],
              },
              false,
              "useFetchedDataStore/setDataResponse",
            );
        },
      }),
      {
        name: "data-storage",
        partialize: (state: DataResponseState) => ({
          dataList: state.dataList,
        }),
      },
    ),
    { name: "Fetched Data store" },
  ),
);
