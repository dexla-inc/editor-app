import { VariableParams, VariableResponse } from "@/requests/variables/types";
import { create } from "zustand";

type VariableList = Array<{ [key: string]: VariableResponse }>;

type VariablesState = {
  [key: string]: any;
  variableList: VariableList;
  initializeVariableList: (response: any) => void;
  setVariable: (variable: VariableParams, id: string) => void;
  deleteVariable: (variableId: string) => void;
};

export const useVariableStore = create<VariablesState>((set, get) => ({
  variableList: [],
  initializeVariableList: (response) => {
    const variableList = response?.results?.map(
      (variable: VariableResponse) => ({
        [variable.name]: variable,
      }),
    );
    set({ variableList });
  },
  setVariable: (variable, id) => {
    const _variableList = get().variableList;
    const index = _variableList.findIndex(
      (item) => item?.[variable.name]?.id === id,
    );
    if (index >= 0) {
      _variableList[index] = { [variable.name]: { id, ...variable } };
      set({ variableList: [..._variableList] });
    }
    set({
      variableList: [
        ..._variableList,
        { [variable.name]: { id, ...variable } },
      ],
    });
  },
  deleteVariable: (variableId) => {
    const _variableList = get().variableList;
    const index = _variableList.findIndex(
      (item) => item?.[variableId]?.id === variableId,
    );
    if (index >= 0) {
      _variableList.splice(index, 1);
      set({ variableList: [..._variableList] });
    }
  },
}));
