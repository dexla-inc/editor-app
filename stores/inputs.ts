import { create } from "zustand";

type InputsState = {
  [key: string]: any;
  setInputValue: (id: string, value: any) => void;
};

export const useInputsStore = create<InputsState>((set) => ({
  setInputValue: (id, value) => set({ [id]: value }),
}));
