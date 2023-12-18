import { DARK_COLOR, GRAY_WHITE_COLOR } from "@/utils/branding";
import { MantineTheme } from "@mantine/core";

export function buttonHoverStyles(theme: MantineTheme) {
  return {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? DARK_COLOR : GRAY_WHITE_COLOR,
    },
  };
}
