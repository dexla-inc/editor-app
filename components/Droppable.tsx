import React, { PropsWithChildren } from "react";
import { BoxProps, Box, useMantineTheme } from "@mantine/core";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { useDroppable } from "@/hooks/useDroppable";
import { useEditorStore } from "@/stores/editor";
import { useOnDrop } from "@/hooks/useOnDrop";

type Props = {
  id: string;
} & BoxProps;

export const Droppable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const onDrop = useOnDrop();

  const { isOver, edge, ...droppable } = useDroppable({
    id,
    activeId: selectedComponentId,
    onDrop,
  });

  const baseBorder = `1px solid ${theme.colors.teal[6]}`;

  const borders = isOver
    ? {
        borderTop:
          edge === "top"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderBottom:
          edge === "bottom"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderLeft:
          edge === "left"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderRight:
          edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px solid ${theme.colors.teal[6]}`
            : baseBorder,
      }
    : {};

  return (
    <Box id={id} w="100%" {...props} style={{ ...borders }} {...droppable}>
      {children}
    </Box>
  );
};
