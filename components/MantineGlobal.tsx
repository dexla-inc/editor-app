import React from "react";
import { Global, useMantineTheme } from "@mantine/core";
import { useUserConfigStore } from "@/stores/userConfig";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";

// Assuming DARK_MODE, LIGHT_MODE, and GREEN_COLOR are constants defined elsewhere
const DARK_MODE = "dark mode background color"; // Example placeholder
const LIGHT_MODE = "light mode background color"; // Example placeholder
const GREEN_COLOR = "green color for text"; // Example placeholder

export const MantineGlobal = () => {
  const theme = useMantineTheme();
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const isLive = useCheckIfIsLive();

  return (
    <Global
      styles={{
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        body: {
          margin: 0,
          padding: 0,
          ...theme.fn.fontStyles(),
          lineHeight: theme.lineHeight,
          maxHeight: "100vh",
          minHeight: "100vh",
          background: !isLive && isDarkTheme ? DARK_MODE : LIGHT_MODE,
          color: !isLive && isDarkTheme ? GREEN_COLOR : theme.colors.black,
          "::-webkit-scrollbar": {
            width: isLive ? "0px" : "8px",
            height: isLive ? "0px" : undefined,
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: !isLive ? "#888" : undefined,
            borderRadius: !isLive ? "10px" : undefined,
          },
          scrollbarWidth: isLive ? "none" : "thin",
          scrollbarColor: !isLive ? "#888 transparent" : undefined,
          msOverflowStyle: isLive ? "none" : "-ms-autohiding-scrollbar",
        },
        html: {
          maxHeight: "-webkit-fill-available",
        },
      }}
    />
  );
};
