import merge from "lodash.merge";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserConfigState = {
  isTabPinned: boolean;
  isShadesActive: boolean;
  initiallyOpenedModifiersByComponent: Record<string, string[]>;
  pageCancelled: boolean;
  navbarWidth?: string | undefined;
  setIsShadesActive: (isShadesActive: boolean) => void;
  setIsTabPinned: (isTabPinned: boolean) => void;
  setInitiallyOpenedModifiersByComponent: (
    componentType: string,
    modifierName: string,
    isOpen: boolean,
  ) => void;
  setPageCancelled: (pageCancelled: boolean) => void;
  setNavbarWidth: (navbarWidth?: string) => void;
};

export const useUserConfigStore = create<UserConfigState>()(
  devtools(
    persist(
      (set) => ({
        isTabPinned: false,
        isShadesActive: false,
        pageCancelled: false,
        navbarWidth: undefined,
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
        setPageCancelled: (pageCancelled: boolean) => {
          set({ pageCancelled }, false, "userConfig/setPageCancelled");
        },
        setNavbarWidth: (navbarWidth?: string) => {
          set({ navbarWidth }, false, "userConfig/setNavbarWidth");
        },
      }),
      {
        name: "user-config",
        partialize: (state: UserConfigState) => ({
          isTabPinned: state.isTabPinned,
          isShadesActive: state.isShadesActive,
          initiallyOpenedModifiersByComponent:
            state.initiallyOpenedModifiersByComponent,
          pageCancelled: state.pageCancelled,
          navbarWidth: state.navbarWidth,
        }),
      },
    ),
    { name: "User Config store" },
  ),
);
