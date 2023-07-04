import {
  NotificationProps,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { create } from "zustand";

export type DexlaNotificationProps = NotificationProps & {
  isError?: boolean;
};

type AppState = {
  isLoading: boolean;
  startLoading: (state: DexlaNotificationProps) => void;
  stopLoading: (state: DexlaNotificationProps) => void;
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
      color: state.isError ? "red" : "teal",
      ...state,
    });

    set({ isLoading: false });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
}));
