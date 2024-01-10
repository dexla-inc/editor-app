import { create } from "zustand";

type InputsState = {
  inputValues: Record<string, any>;
  setInputValue: (id: string, value: any) => void;
  getValue: (id: string) => any;
};

export const useInputsStore = create<InputsState>((set, get) => ({
  inputValues: {},
  setInputValue: (id, value) =>
    set({ inputValues: { ...get().inputValues, [id]: value } }),
  getValue: (id) => get().inputValues[id],
}));
