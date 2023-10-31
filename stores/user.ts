import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserConfigState = {
  isTabPinned: boolean;
  setIsTabPinned: (isTabPinned: boolean) => void;
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
    }),
    {
      name: "user-config",
      partialize: (state: UserConfigState) => ({
        isTabPinned: state.isTabPinned,
      }),
    },
  ),
);
