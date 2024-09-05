import { useDroppable } from "@/hooks/editor/useDroppable";
import { useOnDrop } from "@/hooks/editor/useOnDrop";
import { useEditorStore } from "@/stores/editor";

type Props = {
  componentId: string;
};

export const useEditorDroppableEvents = ({ componentId }: Props) => {
  const onDrop = useOnDrop();
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const droppable = useDroppable({
    id: componentId,
    onDrop: onDrop as any,
    currentWindow: iframeWindow,
  });

  return {
    droppable,
  };
};
