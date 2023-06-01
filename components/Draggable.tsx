import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, BoxProps } from "@mantine/core";

type Props = {
  id: string;
} & BoxProps;

export const Draggable = (props: PropsWithChildren<Props>) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </Box>
  );
};
