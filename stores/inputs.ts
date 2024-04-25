import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InputsState = {
  inputValues: Record<string, any>;
  setInputValue: (id: string, value: any) => void;
};

export const useInputsStore = create<InputsState>()(
  devtools(
    (set) => ({
      inputValues: {},
      setInputValue: (id, value) =>
        set(
          (state) => ({ inputValues: { ...state.inputValues, [id]: value } }),
          false,
          "setInputValue",
        ),
    }),
    {
      name: "Inputs Store",
    },
  ),
);
