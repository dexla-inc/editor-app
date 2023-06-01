import React, { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";
import { GridProps, Grid } from "@mantine/core";

type Props = {
  id: string;
} & GridProps;

export const Droppable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Grid ref={setNodeRef} w="100%" {...props}>
      {children}
    </Grid>
  );
};
