import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InputsState = {
  inputValues: Record<string, any>;
  setInputValue: (id: string, value: any) => void;
  resetInputValues: () => void;
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
      resetInputValues: () =>
        set(() => ({ inputValues: {} }), false, "resetInputValues"),
    }),
    {
      name: "Inputs Store",
    },
  ),
);
