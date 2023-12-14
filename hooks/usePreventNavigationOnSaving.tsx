import { useEditorStore } from "@/stores/editor";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const usePreventNavigationOnSaving = () => {
  const router = useRouter();
  const isSaving = useEditorStore((state) => state.isSaving);

  useEffect(() => {
    const handleRouteChange = () => {
      if (isSaving) {
        const leave = confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        );
        if (!leave) {
          router.events.emit("routeChangeError");
          throw "Abort route change. Please ignore this error.";
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isSaving, router.events]);
};
