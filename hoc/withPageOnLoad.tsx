import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useAppMode } from "@/hooks/useAppMode";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const withPageOnLoad = (WrappedComponent: any) => {
  const Config = (props: any) => {
    const { isPreviewMode } = useAppMode();
    const isLive = useEditorStore((state) => state.isLive);
    const isEditorMode = !isPreviewMode && !isLive;
    const {
      asPath,
      query: { id: projectId, page: pageId },
    } = useRouter();
    const { data: pageListQuery } = usePageListQuery(projectId as string);
    const page = pageListQuery?.results?.find((item) => item.id === pageId)!;
    const { onPageLoad } = useTriggers({ entity: page });

    const isActionApiCall = page?.actions?.some(
      (a) => a.action.name === "apiCall" && a.trigger === "onPageLoad",
    );

    const [isPageValid, setIsPageValid] = useState(
      isEditorMode || !isActionApiCall,
    );

    const onTriggerPageActions = async () => {
      setIsPageValid(isEditorMode || !isActionApiCall);
      if (!isEditorMode) {
        if (!onPageLoad) {
          setIsPageValid(true);
        } else {
          try {
            await onPageLoad?.();
            setIsPageValid(true);
          } catch {}
        }
      }
    };

    useEffect(() => {
      onTriggerPageActions();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditorMode, asPath]);

    if (!isPageValid) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Config;
};
