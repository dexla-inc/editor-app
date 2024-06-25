import { Component, ComponentTree } from "@/utils/editor";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { Skeleton } from "@mantine/core";
import { DataType } from "@/types/dataBinding";

type UseRenderDataProps = {
  component: Component & ComponentTree;
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
  shareableContent,
}: UseRenderDataProps) => {
  const {
    dataType = DataType.static,
    skeletonMinHeight = 400,
    skeletonMinWidth = "100%",
  } = component?.props!;
  const { data: staticData } = component.onLoad!;

  const { data: dynamicData, initiallyLoading } = useEndpoint({
    componentId: component.id!,
    onLoad: component.onLoad,
    dataType,
  });

  const data = dataType === "dynamic" ? dynamicData : staticData;

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
        }),
        // This is used by useComputeValue only in order to build the Item context
        relatedComponentsData: {
          ...(shareableContent?.relatedComponentsData ?? {}),
          ...(data && { [currentComponentGroupId]: data }),
        },
      });
    };

    if (initiallyLoading) {
      return (
        <Skeleton mih={skeletonMinHeight} miw={skeletonMinWidth} w="100%" />
      );
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
