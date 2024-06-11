import { create } from "zustand";
import { devtools } from "zustand/middleware";
import isEmpty from "lodash.isempty";

type InputsState = {
  inputValues: Record<string, any>;
  setInputValue: (id: string, value: any) => void;
  resetInputValues: (ids?: string[]) => void;
};

const typeHandlers: Record<string, (value: any) => any> = {
  number: () => 0,
  string: () => "",
  boolean: () => false,
  object: (value) => (Array.isArray(value) ? [] : {}),
  undefined: () => undefined,
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

            const filteredIds = Object.keys(state.inputValues).reduce(
              (newObj, key) => {
                newObj[key] = state.inputValues[key];
                if (ids?.some((prefix) => key.startsWith(prefix))) {
                  const prevValue = state.inputValues[key];
                  newObj[key] = typeHandlers[typeof prevValue](prevValue);
                }
                return newObj;
              },
              {} as Record<string, any>,
            );

            return {
              inputValues: filteredIds,
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
