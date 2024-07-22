import { useCallback } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useComponentContextMenu } from "@/hooks/components/useComponentContextMenu";
import { isEditorModeSelector } from "@/utils/componentSelectors";

export const useEditorClickHandler = (componentId: string) => {
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const { forceDestroyContextMenu } = useComponentContextMenu();

  return useCallback(
    (e: any) => {
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (!isEditorMode) return;
      e.stopPropagation?.();

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
