import { create } from "zustand";
import { persist } from "zustand/middleware";

type StorageState = {
  storedImages?: File[];
  setStoredImages: (storedImages: File[]) => void;
};
export const useStorage = create<StorageState>()(
  persist(
    (set) => ({
      setStoredImages: (storedImages) => set({ storedImages }),
    }),
    {
      name: "propelauth-storage",
      partialize: (state: StorageState) => ({
        storedImages: state.storedImages,
      }),
    },
  ),
);
