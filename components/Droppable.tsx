import React, { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";
import { GridProps, Grid } from "@mantine/core";
import { useEditorStore } from "@/stores/editor";

type Props = {
  id: string;
} & GridProps;

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
        borderTop: dropTarget?.edge === "top" ? "2px solid blue" : undefined,
        borderBottom:
          dropTarget?.edge === "bottom" ? "2px solid blue" : undefined,
        borderLeft: dropTarget?.edge === "left" ? "2px solid blue" : undefined,
        borderRight:
          dropTarget?.edge === "right" ? "2px solid blue" : undefined,
      }
    : {};

  return (
    <Grid ref={setNodeRef} w="100%" {...props} style={borders}>
      {children}
    </Grid>
  );
};
