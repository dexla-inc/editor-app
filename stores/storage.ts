import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FileObj = { [key: string]: any };

type StorageState = {
  storedImages: Array<FileObj>;
  setStoredImages: (storedImages: Array<FileObj>) => void;
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
