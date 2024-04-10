import { create } from "zustand";

type InputsState = {
  inputValues: Record<string, any>;
  setInputValue: (id: string, value: any) => void;
};

export const useInputsStore = create<InputsState>((set, get) => ({
  inputValues: {},
  // CRITICAL BUG: THIS IS CAUSING RE RENDERS WHEN WE TYPE IN AN INPUT
  setInputValue: (id, value) =>
    set({ inputValues: { ...get().inputValues, [id]: value } }),
}));
