import { create } from "zustand";
import { persist } from "zustand/middleware";
import merge from "lodash.merge";

type UserConfigState = {
  isTabPinned: boolean;
  initiallyOpenedModifiersByComponent: Record<string, string[]>;
  setIsTabPinned: (isTabPinned: boolean) => void;
  setInitiallyOpenedModifiersByComponent: (
    componentType: string,
    modifierName: string,
    isOpen: boolean,
  ) => void;
};

export const useUserConfigStore = create<UserConfigState>()(
  persist(
    (set, get) => ({
      isTabPinned: false,
      setIsTabPinned: (isTabPinned: boolean) => {
        set({
          isTabPinned: isTabPinned,
        });
      },
      setInitiallyOpenedModifiersByComponent: (
        componentType: string,
        modifierName: string,
        isOpen: boolean,
      ) => {
        set((state) => {
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
        });
      },
      initiallyOpenedModifiersByComponent: {},
    }),
    {
      name: "user-config",
      partialize: (state: UserConfigState) => ({
        isTabPinned: state.isTabPinned,
        initiallyOpenedModifiersByComponent:
          state.initiallyOpenedModifiersByComponent,
      }),
    },
  ),
);
