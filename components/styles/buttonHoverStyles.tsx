import { MantineTheme } from "@mantine/core";

export function buttonHoverStyles(theme: MantineTheme) {
  return {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },
  };
}
