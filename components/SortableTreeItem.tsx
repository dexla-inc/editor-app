import React, { PropsWithChildren } from "react";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { Component } from "@/utils/editor";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { useDroppable } from "@/hooks/useDroppable";
import { useEditorStore } from "@/stores/editor";
import { useOnDrop } from "@/hooks/useOnDrop";

type Props = {
  component: Component;
} & BoxProps;

export const SortableTreeItem = ({
  children,
  component,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const onDrop = useOnDrop();

  const { isOver, edge, ...droppable } = useDroppable({
    id: component.id as string,
    activeId: selectedComponentId,
    onDrop,
  });

  const borders = isOver
    ? {
        borderTop:
          edge === "top" || edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
        borderBottom:
          edge === "bottom" || edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
      }
    : {};

  return (
    <Box
      {...droppable}
      w="100%"
      h="100%"
      pos="relative"
      sx={{
        ...borders,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
