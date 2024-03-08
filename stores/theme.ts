import { defaultTheme } from "@/utils/branding";
import { MantineThemeExtended } from "@/utils/types";
import merge from "lodash.merge";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ThemeState = {
  theme: MantineThemeExtended;
  setTheme: (theme: MantineThemeExtended) => void;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: defaultTheme,
        setTheme: (theme) =>
          set(
            (prev) => ({ theme: merge(prev.theme, theme) }),
            false,
            "theme/setTheme",
          ),
      }),
      {
        name: "theme",
        partialize: (state: ThemeState) => ({}),
      },
    ),
    { name: "Theme store" },
  ),
);
