import { useEditorStore } from "@/stores/editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppMode } from "./useAppMode";

export const useContentEditable = (componentId: string) => {
  const [isEditable, setIsEditable] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isPreviewMode } = useAppMode();

  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const toggleEdit = useCallback((enable: boolean) => {
    setIsEditable(enable);
  }, []);

  const exitEditMode = useCallback(() => {
    if (ref.current) {
      updateTreeComponentAttrs([componentId], {
        onLoad: {
          children: { dataType: "static", static: ref.current.innerText },
        },
      });
    }
    toggleEdit(false);
  }, [updateTreeComponentAttrs, componentId, toggleEdit]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isPreviewMode) {
        e.preventDefault();
        toggleEdit(true);
      }
    },
    [toggleEdit, isPreviewMode],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPreviewMode && e.key === "Escape") {
        exitEditMode();
      }
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

  useEffect(() => {
    if (isEditable && ref.current && !isPreviewMode) {
      const currentRef = ref.current;

      // Add the event listener
      currentRef.addEventListener("keydown", handleKeyDown);
      currentRef.focus();

      // Return a cleanup function
      return () => {
        if (currentRef) {
          currentRef.removeEventListener("keydown", handleKeyDown);
        }
      };
    }
  }, [isEditable, isPreviewMode, handleKeyDown]);

  const contentEditableProps = {
    ref,
    contentEditable: isEditable && !isPreviewMode,
    onDoubleClick: handleDoubleClick,
    onBlur: handleBlur,
  };

  return contentEditableProps;
};
