import { VariableParams } from "@/requests/variables/types";
import { create } from "zustand";

type VariablesState = {
  [key: string]: any;
  setVariable: (variable: VariableParams) => void;
};

export const useVariableStore = create<VariablesState>((set) => ({
  setVariable: (variable) => set({ [variable.name]: variable }),
}));
