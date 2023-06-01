import React, { PropsWithChildren } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GridProps, Grid } from "@mantine/core";

type Props = {
  id: string;
} & GridProps;

export const DroppableDraggable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({ id });

  const { setNodeRef: setDroppableRef } = useDroppable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Grid
      ref={(ref) => {
        setDraggableRef(ref);
        setDroppableRef(ref);
      }}
      w="100%"
      style={style}
      {...listeners}
      {...attributes}
      {...props}
    >
      {children}
    </Grid>
  );
};
