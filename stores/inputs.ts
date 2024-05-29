import { create } from "zustand";
import { devtools } from "zustand/middleware";
import isEmpty from "lodash.isempty";

type InputsState = {
  inputValues: Record<string, any>;
  setInputValue: (id: string, value: any) => void;
  resetInputValues: (ids?: string[]) => void;
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
      resetInputValues: (ids) =>
        set(
          (state) => {
            if (isEmpty(ids)) {
              return { inputValues: {} };
            }
            const resetIds = ids!.reduce(
              (acc, id) => {
                acc[id] = undefined;
                return acc;
              },
              {} as Record<string, undefined>,
            );

            return {
              inputValues: { ...state.inputValues, ...resetIds },
            };
          },
          false,
          "resetInputValues",
        ),
    }),
    {
      name: "Inputs Store",
    },
  ),
);
