import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ColProps, Grid } from "@mantine/core";

type Props = {
  id: string;
} & ColProps;

export const Draggable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Grid.Col
      ref={setNodeRef}
      pos="relative"
      style={{ ...style, zIndex: isDragging ? 9999 : undefined }}
      {...listeners}
      {...attributes}
      {...props}
    >
      {children}
    </Grid.Col>
  );
};
