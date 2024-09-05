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
  const isDragging = useEditorStore((state) => state.isDragging);
  const droppable = useDroppable({
    id,
    onDrop: onDrop as any,
    currentWindow: id === "root" ? iframeWindow : undefined,
  });

  return (
    <Box id={id} {...props} {...droppable} p={0}>
      {isDragging && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: `calc(100% / 96) 10px`,
            // zIndex: 9999,
          }}
        />
      )}
      {children}
    </Box>
  );
};
