import { useEditorTreeStore } from "@/stores/editorTree";
import { useCallback, useState } from "react";
import { useAppMode } from "./useAppMode";

export const useContentEditable = (componentId: string, ref: any) => {
  const [isEditable, setIsEditable] = useState(false);
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);

  const toggleEdit = useCallback((enable: boolean) => {
    setIsEditable(enable);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isPreviewMode) {
        e.preventDefault();
        toggleEdit(true);
        ref?.current?.focus();
      }
    },
    [toggleEdit, isPreviewMode, ref],
  );

  const exitEditMode = useCallback(() => {
    if (ref?.current) {
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;
      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: {
          onLoad: {
            children: { dataType: "static", static: ref?.current.innerText },
          },
        },
      });
    }
    toggleEdit(false);
  }, [componentId, toggleEdit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // if (!isPreviewMode && e.key === "Escape") {
      //   exitEditMode();
      // }
    },
    [exitEditMode, isPreviewMode],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!isPreviewMode) {
        e.preventDefault();
        exitEditMode();
      }
    },
    [exitEditMode, isPreviewMode],
  );

  const contentEditableProps = {
    ref,
    ...(!isPreviewMode && {
      contentEditable: isEditable,
      onDoubleClick: handleDoubleClick,
      ...(isEditable && { onBlur: handleBlur, onKeyDown: handleKeyDown }),
    }),
  };

  return contentEditableProps;
};
