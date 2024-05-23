import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { Component, ComponentTree } from "@/utils/editor";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { LoadingOverlay, Skeleton } from "@mantine/core";
import { useEffect } from "react";

type UseRenderDataProps = {
  currentComponentGroupId: string;
  component: Component & ComponentTree;
};

type RenderDataProps = {
  renderTree: any;
  shareableContent: any;
};

type RenderComponentProps = {
  child: ComponentTree;
  data: any;
  parentSuffix: string;
};

export const useRenderData = ({
  component,
  currentComponentGroupId,
}: UseRenderDataProps) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const { dataType = "static" } = component?.props!;
  const { data: staticData, skeletonMinHeight = 400 } = component.onLoad!;

  const setRelatedComponentsData = useEditorTreeStore(
    (state) => state.setRelatedComponentsData,
  );

  const { data: dynamicData, initiallyLoading } = useEndpoint({
    onLoad: component.onLoad,
    dataType,
    includeExampleResponse: !isPreviewMode,
  });

  const data = dataType === "dynamic" ? dynamicData : staticData;

  useEffect(() => {
    if (
      JSON.stringify(
        useEditorTreeStore.getState().relatedComponentsData[
          currentComponentGroupId
        ],
      ) !== JSON.stringify(data)
    ) {
      setRelatedComponentsData({ id: currentComponentGroupId, data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // WARNING: we only want to listen to data changes

  const renderData = ({ renderTree, shareableContent }: RenderDataProps) => {
    const renderComponent = ({
      child,
      data,
      parentSuffix,
    }: RenderComponentProps) => {
      return renderTree(child, {
        ...shareableContent,
        // if data is undefined, we don't want to overwrite the data passed by a parent that is sharing data
        ...(data && { data, parentSuffix }),
      });
    };

    if (initiallyLoading) {
      return <Skeleton mih={skeletonMinHeight} p="xl" w="100%" />;
    }

    if (Array.isArray(data)) {
      return data.map((item: any, parentIndex: number) => {
        let newParentSuffix = `${component.id}__${parentIndex}`;
        // If parentSuffix is in shareableContent, that means there is a parent sharing data, and I want to build a new
        // component id for the current one
        if (shareableContent?.parentSuffix) {
          newParentSuffix = `${shareableContent.parentSuffix}--${component.id}__${parentIndex}`;
        }

        return component.children?.map((child) => {
          return renderComponent({
            child,
            data: item,
            parentSuffix: newParentSuffix,
          });
        });
      });
    } else {
      let newParentSuffix = component.id!;
      // If parentSuffix is in shareableContent, that means there is a parent sharing data, and I want to build a new
      // component id for the current one
      if (shareableContent?.parentSuffix) {
        newParentSuffix = `${shareableContent.parentSuffix}--${newParentSuffix}`;
      }

      return component.children?.map((child) => {
        return renderComponent({
          child,
          data,
          parentSuffix: newParentSuffix,
        });
      });
    }
  };

  return {
    renderData,
    initiallyLoading,
  };
};
