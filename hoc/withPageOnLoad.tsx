import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useAppMode } from "@/hooks/useAppMode";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import { useEffect } from "react";

export const withPageOnLoad = (WrappedComponent: any) => {
  const Config = (props: any) => {
    const { isPreviewMode } = useAppMode();
    const isLive = useEditorStore((state) => state.isLive);
    const isEditorMode = !isPreviewMode && !isLive;
    const projectId = useEditorStore((state) => state.currentProjectId!);
    const pageId = useEditorStore((state) => state.currentPageId!);

    const { data: pageListQuery } = usePageListQuery(projectId);
    const page = pageListQuery?.results?.find((item) => item.id === pageId)!;

    const { onPageLoad } = useTriggers({ entity: page });

    useEffect(() => {
      if (!isEditorMode) {
        onPageLoad?.();
      }
    }, [onPageLoad, isEditorMode]);

    return <WrappedComponent {...props} />;
  };

  return Config;
};
