import { ComponentToBind, useEditorStore } from "@/stores/editor";
import { useCallback } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useComponentContextMenu } from "@/hooks/components/useComponentContextMenu";

export const useEditorClickHandler = (
  componentId: string,
  propsWithOverwrites: any,
  isPicking?: ComponentToBind,
) => {
  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !state.isLive,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const { forceDestroyContextMenu } = useComponentContextMenu();

  return useCallback(
    (e: any) => {
      if (isEditorMode) {
        e.stopPropagation?.();
      }

      if (isPicking) {
        setComponentToBind(componentId);
      } else {
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
      }

      propsWithOverwrites.onClick?.(e);
      forceDestroyContextMenu();
    },
    [
      isEditorMode,
      forceDestroyContextMenu,
      componentId,
      isPicking,
      propsWithOverwrites,
      setComponentToBind,
      setSelectedComponentIds,
    ],
  );
};
