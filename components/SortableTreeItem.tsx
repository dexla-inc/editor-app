import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { Component } from "@/utils/editor";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { CSSProperties, PropsWithChildren } from "react";

type Props = {
  component: Component;
  style?: CSSProperties;
} & BoxProps;

export const SortableTreeItem = ({
  children,
  component,
  style,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
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
      style={{ ...borders, ...style }}
      {...props}
    >
      {children}
    </Box>
  );
};
