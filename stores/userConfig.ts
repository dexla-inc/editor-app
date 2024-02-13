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
  isPreviewMode: boolean;
  setPreviewMode: (isPreviewMode: boolean) => void;
};

export const useUserConfigStore = create<UserConfigState>()(
  devtools(
    persist(
      (set) => ({
        isTabPinned: false,
        isShadesActive: false,
        pageCancelled: false,
        isDarkTheme: false,
        isPreviewMode: false,
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
        setPreviewMode: (isPreviewMode: boolean) => {
          set({ isPreviewMode }, false, "userConfig/setPreviewMode");
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
          isPreviewMode: state.isPreviewMode,
        }),
      },
    ),
    { name: "User Config store" },
  ),
);
