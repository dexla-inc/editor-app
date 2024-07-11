import { useDroppable } from "@/hooks/editor/useDroppable";
import { useOnDrop } from "@/hooks/editor/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = {
  id: string;
} & BoxProps;

export const Droppable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  console.log("Droppable");
  const theme = useMantineTheme();
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);

  const onDrop = useOnDrop();

  const { edge, ...droppable } = useDroppable({
    id,
    onDrop,
    currentWindow: id === "root" ? iframeWindow : undefined,
  });

  const baseBorder = `1px solid ${theme.colors.teal[6]}`;
  const isOver = currentTargetId === id;

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
    <Box
      id={id}
      w="calc(100% - 4px)"
      {...props}
      style={{ ...borders }}
      {...droppable}
    >
      {children}
    </Box>
  );
};
