import { useEditorTreeStore } from "@/stores/editorTree";
import { useEffect, useRef } from "react";

const message = "You have unsaved changes. Are you sure you want to leave?";

export const usePreventNavigationOnSaving = () => {
  const isSaving = useEditorTreeStore((state) => state.isSaving);
  const isSavingRef = useRef(isSaving);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (isSavingRef.current) {
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
  }, []);
};
