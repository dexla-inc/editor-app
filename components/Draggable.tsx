import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import { BoxProps, Box, Card, useMantineTheme } from "@mantine/core";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
} & BoxProps;

export const Draggable = ({
  id,
  children,
  style,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const styles = {
    transform: CSS.Translate.toString(transform),
    ...style,
    cursor: "move",
  };

  return (
    <Box
      pos="relative"
      ref={setNodeRef}
      w="100%"
      {...props}
      style={{ ...styles }}
      {...listeners}
      {...attributes}
    >
      <Card
        w="100%"
        withBorder
        pos="relative"
        sx={{
          ":hover": {
            boxShadow: theme.shadows.sm,
          },
        }}
      >
        {children}
      </Card>
    </Box>
  );
};
