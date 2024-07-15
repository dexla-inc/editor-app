import { defaultTheme } from "@/utils/branding";
import { getColorFromTheme } from "@/utils/editor";
import { MantineThemeExtended } from "@/types/types";
import { NotificationProps, showNotification } from "@mantine/notifications";
import merge from "lodash.merge";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import isEqual from "lodash.isequal";

type ThemeState = {
  theme: MantineThemeExtended;
  setTheme: (theme: MantineThemeExtended) => void;
  showNotification: (props: NotificationProps) => void;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: defaultTheme,
        setTheme: (theme) =>
          set(
            (prev) => ({
              theme: theme,
            }),
            false,
            "theme/setTheme",
          ),
        showNotification: (props: NotificationProps) => {
          const theme = get().theme;
          const isDarkTheme = theme.colorScheme === "dark";
          const color = props.color || getColorFromTheme(theme, "Primary.6");
          const titleColor = getColorFromTheme(
            theme,
            isDarkTheme ? "White.6" : "Black.6",
          );
          const descriptionColor = getColorFromTheme(theme, "Black.3");
          showNotification({
            ...props,
            bg: isDarkTheme ? "dark" : "white",
            styles: () => ({
              root: {
                "&::before": { backgroundColor: color },
              },
              title: {
                color: titleColor,
              },
              description: {
                color: descriptionColor,
              },
            }),
          });
        },
      }),
      {
        name: "theme",
        partialize: (state: ThemeState) => ({}),
      },
    ),
    { name: "Theme store" },
  ),
);
