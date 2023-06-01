import React, { PropsWithChildren } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GridProps, Grid } from "@mantine/core";
import { useEditorStore } from "@/stores/editor";

type Props = {
  id: string;
} & GridProps;

export const DroppableDraggable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const dropTeditorTree = useEditorStore((state) => state.tree);
  const dropTarget = useEditorStore((state) => state.dropTarget);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const { setNodeRef: setDroppableRef } = useDroppable({ id });
  const isOver = dropTarget?.id === id && !isDragging;

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

  const style = {
    transform: CSS.Translate.toString(transform),
    ...borders,
  };

  return (
    <Grid
      ref={(ref) => {
        setDraggableRef(ref);
        setDroppableRef(ref);
      }}
      w="100%"
      {...listeners}
      {...attributes}
      {...props}
      style={style}
    >
      {children}
    </Grid>
  );
};
