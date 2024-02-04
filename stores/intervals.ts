import { create } from "zustand";

type intervalState = {
  interval: Record<string, any>;
  setInterval: (
    id: string,
    prop: string,
    interval: any,
    initialValue: string,
  ) => void;
  clearInterval: () => void;
};

export const useintervalStore = create<intervalState>((set, get) => ({
  interval: {},
  setInterval: (id, prop, intervalName, initialValue) =>
    set({
      interval: { ...get().interval, id, prop, intervalName, initialValue },
    }),
  clearInterval: () => (get().interval = {}),
}));
