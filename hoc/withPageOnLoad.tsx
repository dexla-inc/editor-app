import { useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor";
import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useTriggers } from "@/hooks/useTriggers";
import { useRouter } from "next/router";

export const withPageOnLoad = (WrappedComponent: any) => {
  const Config = (props: any) => {
    const isEditorMode = useEditorStore(
      (state) => !state.isPreviewMode && !state.isLive,
    );
    const {
      asPath,
      query: { id: projectId, page: pageId },
    } = useRouter();
    const { data: pageListQuery } = usePageListQuery(projectId as string);
    const page = pageListQuery?.results?.find((item) => item.id === pageId)!;
    const { onPageLoad } = useTriggers({ entity: page });

    const [isPageValid, setIsPageValid] = useState(isEditorMode || !onPageLoad);

    const onTriggerPageActions = async () => {
      setIsPageValid(isEditorMode || !onPageLoad);
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
