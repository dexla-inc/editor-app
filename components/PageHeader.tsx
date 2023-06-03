import { Box, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";

export const PageHeader = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();

  return (
    <Box
      h={HEADER_HEIGHT}
      px="lg"
      pos="fixed"
      display="flex"
      w={`calc(100% - ${NAVBAR_WIDTH}px)`}
      bg="white"
      style={{
        alignItems: "center",
        borderBottom: "1px solid",
        borderBottomColor: theme.colors.gray[2],
        fontSize: theme.fontSizes.sm,
        zIndex: 10,
      }}
    >
      {children}
    </Box>
  );
};
