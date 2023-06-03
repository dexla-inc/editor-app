import React, { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";
import { BoxProps, Box } from "@mantine/core";
import { useEditorStore } from "@/stores/editor";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";

type Props = {
  id: string;
} & BoxProps;

export const Droppable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const dropTarget = useEditorStore((state) => state.dropTarget);
  const { setNodeRef } = useDroppable({ id });

  const isOver = dropTarget?.id === id;

  const borders = isOver
    ? {
        border: `1px solid blue`,
        borderTop:
          dropTarget?.edge === "top"
            ? `${DROP_INDICATOR_WIDTH}px solid blue`
            : undefined,
        borderBottom:
          dropTarget?.edge === "bottom"
            ? `${DROP_INDICATOR_WIDTH}px solid blue`
            : undefined,
        borderLeft:
          dropTarget?.edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid blue`
            : undefined,
        borderRight:
          dropTarget?.edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px solid blue`
            : undefined,
      }
    : {};

  return (
    <Box ref={setNodeRef} w="100%" {...props} style={{ ...borders }}>
      {children}
    </Box>
  );
};
