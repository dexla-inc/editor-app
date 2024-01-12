import { VariableParams, VariableResponse } from "@/requests/variables/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type VariableList = Array<VariableResponse>;

type VariablesState = {
  variableList: VariableList;
  initializeVariableList: (variableList: VariableList) => void;
  setVariable: (variable: VariableParams, id: string) => void;
  deleteVariable: (variableId: string) => void;
};

export const useVariableStore = create<VariablesState>()(
  persist(
    (set, get) => ({
      variableList: [],
      initializeVariableList: async (variableList) => {
        set({ variableList });
      },
      setVariable: (variable, id) => {
        const _variableList = get().variableList;

        const index = _variableList.findIndex((item) => item?.id === id);
        if (index >= 0) {
          _variableList[index] = { id, ...variable };
          set({ variableList: [..._variableList] });
        } else
          set({
            variableList: [..._variableList, { id, ...variable }],
          });
      },
      deleteVariable: (variableId) => {
        const _variableList = get().variableList;
        const index = _variableList.findIndex(
          (item) => item?.id === variableId,
        );
        if (index >= 0) {
          _variableList?.splice(index, 1);
          set({ variableList: [...(_variableList ?? [])] });
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
);
