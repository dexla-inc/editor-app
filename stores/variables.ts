import { VariableResponse } from "@/requests/variables/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type VariableStoreParams = VariableResponse & {
  value?: any | null;
};

type VariablesState = {
  variableList: Array<VariableStoreParams>;
  initializeVariableList: (variableList: Array<VariableResponse>) => void;
  setVariable: (variable: Partial<VariableStoreParams>) => void;
  deleteVariable: (variableId: string) => void;
};

export const useVariableStore = create<VariablesState>()(
  devtools(
    persist(
      (set, get) => ({
        variableList: [] as Array<VariableStoreParams>,
        initializeVariableList: (variableList) => {
          const newVariableList: Array<VariableStoreParams> = variableList
            .map((variable) => {
              const existingVariable = get().variableList.find(
                (v) => v.id === variable.id,
              );
              return {
                ...variable,
                value: variable.isGlobal
                  ? existingVariable?.value ?? null
                  : variable.defaultValue,
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));

          set(
            { variableList: newVariableList },
            false,
            "variables/initializeVariableList",
          );
        },
        setVariable: (variable: Partial<VariableStoreParams>) => {
          set(
            (state) => {
              const index = state.variableList.findIndex(
                (item) => item.id === variable.id,
              );
              let newVariableList = [...state.variableList];

              if (index >= 0) {
                newVariableList[index] = {
                  ...newVariableList[index],
                  ...variable,
                };
              } else if (variable.id) {
                const newVariable: VariableStoreParams = {
                  ...(variable as VariableStoreParams),
                  value: variable.value ?? variable.defaultValue,
                };
                newVariableList = [...newVariableList, newVariable];
              }

              return { variableList: newVariableList };
            },
            false,
            "variables/setVariable",
          );
        },
        deleteVariable: (variableId) => {
          const _variableList = get().variableList;
          const index = _variableList.findIndex(
            (item) => item.id === variableId,
          );
          if (index >= 0) {
            _variableList.splice(index, 1);
            set(
              { variableList: [..._variableList] },
              false,
              "variables/deleteVariable",
            );
          }
        },
      }),
      {
        name: "variables-storage",
        partialize: (state) => ({
          variableList: state.variableList
            .filter((v) => v.isGlobal)
            .map(({ id, value, isGlobal }) => ({ id, value, isGlobal })),
        }),
      },
    ),
  ),
);
