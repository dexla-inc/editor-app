import { useCallback } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useComponentContextMenu } from "@/hooks/components/useComponentContextMenu";
import { useEditorStore } from "@/stores/editor";

export const useEditorClickHandler = (componentId: string) => {
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const { forceDestroyContextMenu } = useComponentContextMenu();
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const setGridParentElement = useEditorStore(
    (state) => state.setGridParentElement,
  );

  return useCallback(
    (e: any) => {
      e.stopPropagation?.();

      const modalBody = iframeWindow?.document.querySelector(
        ".iframe-canvas-Modal-body",
      );

      if (modalBody) {
        setGridParentElement("modal");
      } else {
        setGridParentElement("canvas");
      }

      if (e.ctrlKey || e.metaKey) {
        setSelectedComponentIds((prev) => {
          if (prev.includes(componentId)) {
            return prev.filter((p) => p !== componentId);
          }
          return [...prev, componentId];
        });
      } else {
        setSelectedComponentIds(() => [componentId]);
      }

      forceDestroyContextMenu();
    },
    [forceDestroyContextMenu, componentId, setSelectedComponentIds],
  );
};
