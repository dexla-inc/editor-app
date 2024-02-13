import { useUserConfigStore } from "@/stores/userConfig";
import { useEffect, useRef, useState } from "react";

// TODO: Get the mode of editor, preview or live instead of lots of booleans
export const useAppMode = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(
    useUserConfigStore.getState().isPreviewMode,
  );

  const isPreviewModeRef = useRef(useUserConfigStore.getState().isPreviewMode);

  useEffect(() => {
    // Subscribe to isPreviewMode changes
    const unsubscribe = useUserConfigStore.subscribe((state) => {
      setIsPreviewMode(state.isPreviewMode);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Return current value of isPreviewMode
  return isPreviewMode;
};
