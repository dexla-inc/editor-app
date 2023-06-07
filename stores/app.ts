import {
  NotificationProps,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { create } from "zustand";

type AppState = {
  isLoading: boolean;
  startLoading: (state: NotificationProps) => void;
  stopLoading: (state: NotificationProps) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  startLoading: (state) => {
    showNotification({
      loading: true,
      withBorder: true,
      autoClose: false,
      ...state,
    });

    set({ isLoading: true });
  },
  stopLoading: (state) => {
    updateNotification({
      loading: false,
      withBorder: true,
      id: state.id ?? "",
      autoClose: 4000,
      color: "teal",
      ...state,
    });

    set({ isLoading: false });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
}));
