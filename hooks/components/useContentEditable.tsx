import { useEditorTreeStore } from "@/stores/editorTree";
import { useCallback, useState } from "react";
import { getStaticLanguageValue } from "@/utils/data";
import merge from "lodash.merge";

export const useContentEditable = (componentId: string, ref: any) => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = useCallback((enable: boolean) => {
    setIsEditable(enable);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;

      if (!isPreviewMode) {
        e.preventDefault();
        toggleEdit(true);
        ref?.current?.focus();
      }
    },
    [toggleEdit, ref],
  );

  const exitEditMode = useCallback(() => {
    if (ref?.current) {
      const language = useEditorTreeStore.getState().language;
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;
      const value = ref?.current.innerText;

      const staticValues = getStaticLanguageValue(componentId, "children");
      const updatedChildrenStaticValues = merge(staticValues, {
        children: { static: { [language]: value } },
      });

      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: {
          onLoad: updatedChildrenStaticValues,
        },
      });
    }
    toggleEdit(false);
  }, [componentId, toggleEdit, ref]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
      if (!isPreviewMode && e.key === "Escape") {
        exitEditMode();
      }
    },
    [exitEditMode],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
      if (!isPreviewMode) {
        e.preventDefault();
        exitEditMode();
      }
    },
    [exitEditMode],
  );

  const contentEditableProps = {
    ref,
    contentEditable: isEditable,
    onDoubleClick: handleDoubleClick,
    ...(isEditable && { onBlur: handleBlur, onKeyDown: handleKeyDown }),
  };

  return contentEditableProps;
};
