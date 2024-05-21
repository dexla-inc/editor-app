import { VariableResponse } from "@/requests/variables/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { listVariables } from "@/requests/variables/queries-noauth";

type VariableStoreParams = VariableResponse & {
  value?: any | null;
};

type VariablesState = {
  resetVariable: (variableId: string) => void;
  initializeVariableList: (projectId: string) => Promise<void>;
  setVariable: (variable: Partial<VariableStoreParams>) => void;
  deleteVariable: (variableId: string) => void;
  variableList: Record<string, VariableStoreParams>;
};

export const useVariableStore = create<VariablesState>()(
  devtools(
    persist(
      (set, get) => ({
        resetVariable: (variableId) => {
          set(
            (state) => {
              const newVariableList = Object.keys(state.variableList).reduce(
                (acc, key) => {
                  if (key === variableId) {
                    acc[key] = {
                      ...state.variableList[key],
                      value: state.variableList[key].defaultValue,
                    };
                  } else {
                    acc[key] = state.variableList[key];
                  }
                  return acc;
                },
                {} as Record<string, VariableStoreParams>,
              );

              return { variableList: newVariableList };
            },
            false,
            "variables/resetVariable",
          );
        },
        initializeVariableList: async (projectId) => {
          const variableList = await listVariables(projectId);
          const newVariableList: Record<string, VariableStoreParams> =
            variableList.results.reduce(
              (acc, variable) => {
                acc[variable.id] = {
                  ...variable,
                  value: variable.isGlobal
                    ? get().variableList[variable.id]?.value ?? null
                    : variable.defaultValue,
                };
                return acc;
              },
              {} as Record<string, VariableStoreParams>,
            );
          set(
            { variableList: newVariableList },
            false,
            "variables/initializeVariableList",
          );
        },

        setVariable: (variable) => {
          const variableId = variable?.id ?? "";
          set(
            (state) => {
              const newVariableList = { ...state.variableList };
              if (variableId in newVariableList) {
                newVariableList[variableId] = {
                  ...newVariableList[variableId],
                  ...variable,
                };
              } else if (variable.id) {
                newVariableList[variable.id] = {
                  ...(variable as VariableStoreParams),
                  value: variable.value ?? variable.defaultValue,
                };
              }

              return { variableList: newVariableList };
            },
            false,
            "variables/setVariable",
          );
        },
        deleteVariable: (variableId) => {
          const newVariableList = { ...get().variableList };
          delete newVariableList[variableId];
          set(
            { variableList: newVariableList },
            false,
            "variables/deleteVariable",
          );
        },
        variableList: {},
      }),
      {
        name: "variables-storage",
        partialize: (state) => ({
          variableList: Object.values(state.variableList)
            ?.filter((v) => v.isGlobal)
            ?.reduce(
              (acc, { id, value, isGlobal }) => ({
                ...acc,
                [id]: { id, value, isGlobal },
              }),
              {},
            ),
        }),
      },
    ),
    { name: "Variable store" },
  ),
);
