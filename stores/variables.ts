import { VariableParams, VariableResponse } from "@/requests/variables/types";
import { create } from "zustand";

type VariableList = Array<VariableResponse>;

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
      (variable: VariableResponse) => variable,
    );
    set({ variableList });
  },
  setVariable: (variable, id) => {
    const _variableList = get().variableList;
    const index = _variableList.findIndex((item) => item?.id === id);
    if (index >= 0) {
      _variableList[index] = { id, ...variable };
      set({ variableList: [..._variableList] });
    }
    set({
      variableList: [..._variableList, { id, ...variable }],
    });
  },
  deleteVariable: (variableId) => {
    const _variableList = get().variableList;
    const index = _variableList.findIndex((item) => item?.id === variableId);
    if (index >= 0) {
      _variableList.splice(index, 1);
      set({ variableList: [..._variableList] });
    }
  },
}));
