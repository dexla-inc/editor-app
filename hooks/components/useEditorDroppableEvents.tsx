import { useDroppable } from "@/hooks/editor/useDroppable";
import { useOnDrop } from "@/hooks/editor/useOnDrop";
import { useEditorStore } from "@/stores/editor";

type Props = {
  componentId: string;
};

export const useEditorShadows = ({ componentId }: Props) => {
  const onDrop = useOnDrop();
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const droppable = useDroppable({
    id: componentId,
    onDrop,
    currentWindow: iframeWindow,
  });

  return {
    droppable,
  };
};
