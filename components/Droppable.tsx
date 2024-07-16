import { useDroppable } from "@/hooks/editor/useDroppable";
import { useOnDrop } from "@/hooks/editor/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Box, BoxProps } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = {
  id: string;
} & BoxProps;

export const Droppable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const onDrop = useOnDrop();
  const droppable = useDroppable({
    id,
    onDrop,
    currentWindow: id === "root" ? iframeWindow : undefined,
  });

  return (
    <Box id={id} w="calc(100% - 4px)" {...props} {...droppable}>
      {children}
    </Box>
  );
};
