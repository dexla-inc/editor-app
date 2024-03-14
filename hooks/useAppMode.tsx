import { useEffect, useRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";

// TODO: Get the mode of editor, preview or live instead of lots of booleans
export const useAppMode = () => {
  // Initialize ref with the current value of isPreviewMode
  const isPreviewModeRef = useRef(useEditorTreeStore.getState().isPreviewMode);

  useEffect(() => {
    // Subscribe to isPreviewMode changes
    const unsubscribe = useEditorTreeStore.subscribe((state, prevState) => {
      // Check if isPreviewMode has changed
      if (state.isPreviewMode !== prevState.isPreviewMode) {
        // Update ref if there is a change
        isPreviewModeRef.current = state.isPreviewMode;
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Return current value of isPreviewMode and ref itself for more control
  return { isPreviewMode: isPreviewModeRef.current, isPreviewModeRef };
};
