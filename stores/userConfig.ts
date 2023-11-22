import merge from "lodash.merge";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserConfigState = {
  isTabPinned: boolean;
  isShadesActive: boolean;
  initiallyOpenedModifiersByComponent: Record<string, string[]>;
  setIsShadesActive: (isShadesActive: boolean) => void;
  setIsTabPinned: (isTabPinned: boolean) => void;
  setInitiallyOpenedModifiersByComponent: (
    componentType: string,
    modifierName: string,
    isOpen: boolean,
  ) => void;
};

export const useUserConfigStore = create<UserConfigState>()(
  devtools(
    persist(
      (set) => ({
        isTabPinned: false,
        isShadesActive: false,
        setIsShadesActive: (isShadesActive: boolean) => {
          set({ isShadesActive }, false, "userConfig/setIsShadesActive");
        },
        setIsTabPinned: (isTabPinned: boolean) => {
          set(
            {
              isTabPinned: isTabPinned,
            },
            false,
            "userConfig/setIsTabPinned",
          );
        },
        setInitiallyOpenedModifiersByComponent: (
          componentType: string,
          modifierName: string,
          isOpen: boolean,
        ) => {
          set(
            (state) => {
              const { initiallyOpenedModifiersByComponent } = state;

              let newValue = (
                initiallyOpenedModifiersByComponent[componentType] ?? []
              ).filter((modifier) => modifier !== modifierName);

              if (isOpen) {
                newValue.push(modifierName);
              }

              const result = merge({}, initiallyOpenedModifiersByComponent, {
                [componentType]: newValue,
              });

              return {
                ...state,
                initiallyOpenedModifiersByComponent: result,
              };
            },
            false,
            "userConfig/setInitiallyOpenedModifiersByComponent",
          );
        },
        initiallyOpenedModifiersByComponent: {},
      }),
      {
        name: "user-config",
        partialize: (state: UserConfigState) => ({
          isTabPinned: state.isTabPinned,
          isShadesActive: state.isShadesActive,
          initiallyOpenedModifiersByComponent:
            state.initiallyOpenedModifiersByComponent,
        }),
      },
    ),
    { name: "User Config store" },
  ),
);
