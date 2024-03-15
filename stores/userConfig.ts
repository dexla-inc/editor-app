import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserConfigState = {
  isTabPinned: boolean;
  isShadesActive: boolean;
  initiallyOpenedModifiersByComponent: Record<string, string[]>;
  pageCancelled: boolean;
  setIsShadesActive: (isShadesActive: boolean) => void;
  setIsTabPinned: (isTabPinned: boolean) => void;
  setInitiallyOpenedModifiersByComponent: (
    componentType: string,
    modifierName: string,
    isOpen: boolean,
  ) => void;
  setPageCancelled: (pageCancelled: boolean) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
  navbarWidth: number;
  setNavbarWidth: (navbarWidth: number) => void;
  isCustomComponentModalOpen: boolean;
  setIsCustomComponentModalOpen: (
    isCustomComponentModalOpen: boolean,
  ) => Promise<void>;
};

export const useUserConfigStore = create<UserConfigState>()(
  devtools(
    persist(
      (set) => ({
        isTabPinned: false,
        isShadesActive: false,
        pageCancelled: false,
        isDarkTheme: false,
        navbarWidth: 50,
        isCustomComponentModalOpen: false,
        setIsDarkTheme: (isDarkTheme: boolean) => {
          set({ isDarkTheme }, false, "userConfig/setIsDarkTheme");
        },
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

              initiallyOpenedModifiersByComponent[componentType] = newValue;

              return {
                ...state,
                initiallyOpenedModifiersByComponent,
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
        setNavbarWidth: (navbarWidth: number) => {
          set({ navbarWidth }, false, "userConfig/setNavbarWidth");
        },
        setIsCustomComponentModalOpen: async (
          isCustomComponentModalOpen: boolean,
        ) => {
          set(
            { isCustomComponentModalOpen },
            false,
            "userConfig/setIsCustomComponentModalOpen",
          );
        },
      }),
      {
        name: "user-config",
        partialize: (state: UserConfigState) => ({
          isTabPinned: state.isTabPinned,
          isShadesActive: state.isShadesActive,
          isDarkTheme: state.isDarkTheme,
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
