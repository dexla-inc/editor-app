import { useEditorTreeStore } from "@/stores/editorTree";
import { useCallback, useState } from "react";

export const useContentEditable = (componentId: string, ref: any) => {
  const [isEditable, setIsEditable] = useState(false);
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);

  const toggleEdit = useCallback((enable: boolean) => {
    setIsEditable(enable);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // TODO: re-enable this
      // if (!isPreviewMode) {
      //   e.preventDefault();
      //   toggleEdit(true);
      //   ref?.current?.focus();
      // }
    },
    [toggleEdit, isPreviewMode, ref],
  );

  const exitEditMode = useCallback(() => {
    if (ref?.current) {
      const language = useEditorTreeStore.getState().language;
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;
      const value = ref?.current.innerText;
      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: {
          onLoad: {
            children: {
              dataType: "static",
              // TODO: REVIEW THIS
              static: { [language]: value },
            },
          },
        },
      });
    }
    toggleEdit(false);
  }, [componentId, toggleEdit, ref]);

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
