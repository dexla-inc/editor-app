import React, { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";

type Props = {
  component: Component;
  draggableProps: any;
} & BoxProps;

export const SortableTreeItem = ({
  children,
  component,
  draggableProps,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const dropTarget = useEditorStore((state) => state.dropTarget);

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: component.id as string,
  });

  const isOver = dropTarget?.id === component.id && !draggableProps.isDragging;

  const borders = isOver
    ? {
        borderTop:
          dropTarget?.edge === "top" || dropTarget?.edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
        borderBottom:
          dropTarget?.edge === "bottom" || dropTarget?.edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : undefined,
      }
    : {};

  const style = {
    transform: CSS.Translate.toString(draggableProps.transform),
    ...borders,
  };

  return (
    <Box
      ref={(ref) => {
        draggableProps?.setNodeRef?.(ref);
        setDroppableRef(ref);
      }}
      w="100%"
      h="100%"
      pos="relative"
      sx={{
        zIndex: draggableProps.isDragging ? 9999 : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
