import { useUserConfigStore } from "@/stores/userConfig";
import { useEffect, useRef } from "react";

// TODO: Get the mode of editor, preview or live instead of lots of booleans
export const useAppMode = () => {
  // Initialize ref with the current value of isPreviewMode
  const isPreviewModeRef = useRef(useUserConfigStore.getState().isPreviewMode);

  useEffect(() => {
    // Subscribe to isPreviewMode changes
    const unsubscribe = useUserConfigStore.subscribe((state, prevState) => {
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
