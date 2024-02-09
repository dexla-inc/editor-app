import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor";
import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useTriggers } from "@/hooks/useTriggers";

export const withPageOnLoad = (WrappedComponent: any) => {
  const Config = (props: any) => {
    const isEditorMode = useEditorStore(
      (state) => !state.isPreviewMode && !state.isLive,
    );
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
