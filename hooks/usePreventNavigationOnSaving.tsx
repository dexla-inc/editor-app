import { useEditorStore } from "@/stores/editor";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const message = "You have unsaved changes. Are you sure you want to leave?";
const errorMessage = "Abort route change. Please ignore this error.";

export const usePreventNavigationOnSaving = () => {
  const router = useRouter();
  const isSaving = useEditorStore((state) => state.isSaving);
  const isSavingRef = useRef(isSaving);
  const resetTree = useEditorStore((state) => state.resetTree);
  const liveblocks = useEditorStore((state) => state.liveblocks);

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

    const handleRouteChange = (url: string, options: { shallow: boolean }) => {
      if (isSaving) {
        const leave = confirm(message);
        if (!leave) {
          router.events.emit("routeChangeError");
          throw errorMessage;
        }

        if (!options.shallow) {
          resetTree();
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isSaving, router.events, resetTree]);
};
