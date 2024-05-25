import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { Component, ComponentTree } from "@/utils/editor";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { Skeleton } from "@mantine/core";
import { useEffect, useTransition } from "react";

type UseRenderDataProps = {
  component: Component & ComponentTree;
  currentComponentGroupId: string;
  shareableContent: any;
};

type RenderDataProps = {
  renderTree: any;
};

type RenderComponentProps = {
  child: ComponentTree;
  data: any;
  parentSuffix: string;
  currentComponentGroupId: string;
};

export const useRenderData = ({
  component,
  currentComponentGroupId: test,
  shareableContent,
}: UseRenderDataProps) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const { dataType = "static" } = component?.props!;
  const { data: staticData, skeletonMinHeight = 400 } = component.onLoad!;
  const [isPending, startTransition] = useTransition();

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
    const parentDataId = shareableContent?.parentDataId;
    if (
      parentDataId !== undefined &&
      JSON.stringify(
        useEditorTreeStore.getState().relatedComponentsData[parentDataId],
      ) !== JSON.stringify(shareableContent?.data)
    ) {
      startTransition(() => {
        setRelatedComponentsData({
          id: parentDataId,
          data: shareableContent.data,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareableContent?.data]); // WARNING: we only want to listen to shareableContent.data changes

  const renderData = ({ renderTree }: RenderDataProps) => {
    const renderComponent = ({
      child,
      data,
      parentSuffix,
      currentComponentGroupId,
    }: RenderComponentProps) => {
      return renderTree(child, {
        ...shareableContent,
        // if data is undefined, we don't want to overwrite the data passed by a parent that is sharing data
        ...(data && {
          data,
          parentSuffix,
          // this is the parentId that later is used to populate the Item context in the binding popover
          parentDataId: currentComponentGroupId,
        }),
        // This is used by useComputeValue only in order to build the Item context
        relatedComponentsData: {
          ...(shareableContent?.relatedComponentsData ?? {}),
          ...(data && { [currentComponentGroupId]: data }),
        },
      });
    };

    if (initiallyLoading) {
      return <Skeleton mih={skeletonMinHeight} p="xl" w="100%" />;
    }

    if (Array.isArray(data)) {
      return data.map((item: any, parentIndex: number) => {
        // Build parentSuffix for the current component
        const currentComponentGroupId = `${component.id}__${parentIndex}`;
        let newParentSuffix = currentComponentGroupId;
        if (shareableContent?.parentSuffix) {
          newParentSuffix = `${shareableContent.parentSuffix}--${component.id}__${parentIndex}`;
        }

        return component.children?.map((child) => {
          return renderComponent({
            child,
            data: item,
            parentSuffix: newParentSuffix,
            currentComponentGroupId,
          });
        });
      });
    } else {
      let newParentSuffix = component.id!;
      // Build parentSuffix for the current component
      if (shareableContent?.parentSuffix) {
        newParentSuffix = `${shareableContent.parentSuffix}--${newParentSuffix}`;
      }

      return component.children?.map((child) => {
        return renderComponent({
          child,
          data,
          parentSuffix: newParentSuffix,
          currentComponentGroupId: component.id!,
        });
      });
    }
  };

  return {
    renderData,
    initiallyLoading,
  };
};
