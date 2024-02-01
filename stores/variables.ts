import { VariableParams, VariableResponse } from "@/requests/variables/types";
import isEqual from "lodash.isequal";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type VariableList = Array<VariableResponse>;

type VariablesState = {
  variableList: VariableList;
  initializeVariableList: (variableList: VariableList) => void;
  setVariable: (variable: Partial<VariableParams>, id: string) => void;
  deleteVariable: (variableId: string) => void;
};

export const useVariableStore = create<VariablesState>()(
  devtools(
    persist(
      (set, get) => ({
        variableList: [],
        initializeVariableList: (variableList) => {
          const _variableList = get().variableList;
          const isArraysEqual = isEqual(_variableList, variableList);
          if (!isArraysEqual)
            set({ variableList }, false, "variables/initializeVariableList");
        },
        setVariable: (varProps, id) => {
          const _variableList = get().variableList;

          const index = _variableList.findIndex((item) => item?.id === id);
          if (index >= 0) {
            _variableList[index] = { ..._variableList[index], ...varProps };
            set(
              { variableList: [..._variableList] },
              false,
              "variables/setVariable",
            );
          } else {
            set(
              {
                variableList: [
                  ..._variableList,
                  { id, ...(varProps as VariableParams) },
                ],
              },
              false,
              "variables/setVariable",
            );
          }
        },
        deleteVariable: (variableId) => {
          const _variableList = get().variableList;
          const index = _variableList.findIndex(
            (item) => item?.id === variableId,
          );
          if (index >= 0) {
            _variableList?.splice(index, 1);
            set(
              { variableList: [...(_variableList ?? [])] },
              false,
              "variables/deleteVariable",
            );
          }
        },
      }),
      {
        name: "variables-storage",
        partialize: (state: VariablesState) => ({
          variableList: state.variableList,
        }),
      },
    ),
    { name: "Variables store" },
  ),
);
