import { Box, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";

export const GridColumn = ({
  children,
  style,
  span,
  ...props
}: PropsWithChildren<any>) => {
  const theme = useMantineTheme();

  return (
    <>
      <Box
        p="xs"
        display="grid"
        style={{
          ...(style ?? {}),
          gridColumn: `span ${span}`,
          gap: theme.spacing.xs,
        }}
        pos="relative"
        {...props}
      >
        {children}
      </Box>
    </>
  );
};
