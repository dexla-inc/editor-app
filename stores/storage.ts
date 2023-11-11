import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type StorageState = {
  storedImages: File[];
  setStoredImages: (storedImages: File[]) => void;
};
export const useStorage = create<StorageState>()(
  persist(
    (set) => ({
      storedImages: [],
      setStoredImages: (storedImages) => set({ storedImages }),
    }),
    {
      name: "files-storage",
      partialize: (state: StorageState) => ({
        storedImages: state.storedImages,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
