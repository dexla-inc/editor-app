import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
    (set, get) => {
      const batchedUpdates: Record<string, any> = {};

      const flushBatchedUpdates = debounce(() => {
        set(
          (state) => ({
            inputValues: { ...state.inputValues, ...batchedUpdates },
          }),
          false,
          "batchedSetInputValue",
        );
        Object.keys(batchedUpdates).forEach(
          (key) => delete batchedUpdates[key],
        );
      }, 50);

      return {
        inputValues: {},
        setInputValue: (id, value) => {
          const currentValue = get().inputValues[id];
          if (!isEqual(currentValue, value)) {
            batchedUpdates[id] = value;
            flushBatchedUpdates();
          }
        },
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
      };
    },
    {
      name: "Inputs Store",
    },
  ),
);
