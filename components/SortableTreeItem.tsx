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
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const onDrop = useOnDrop();
  const id = `layer-${component.id}`;

  const { edge, ...droppable } = useDroppable({
    id,
    activeId: selectedComponentId,
    onDrop,
  });

  const isOver = currentTargetId === id;

  const borders = isOver
    ? {
        border: `1px solid ${theme.colors.teal[6]}`,
        borderTop:
          edge === "top" || edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
        borderBottom:
          edge === "bottom" || edge === "right" || edge === "center"
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
      sx={{ ...borders, marginBottom: "3px" }}
      {...props}
    >
      {children}
    </Box>
  );
};
