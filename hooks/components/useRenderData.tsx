import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { Component, ComponentTree } from "@/utils/editor";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { LoadingOverlay, Skeleton } from "@mantine/core";

type UseRenderDataProps = {
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
  currentComponentGroupId: string;
};

export const useRenderData = ({ component }: UseRenderDataProps) => {
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

  const renderData = ({ renderTree, shareableContent }: RenderDataProps) => {
    const renderComponent = ({
      child,
      data,
      parentSuffix,
      currentComponentGroupId,
    }: RenderComponentProps) => {
      // WARNING: If you redux devtools is failing, you might want to comment this line
      // doing this so I can use parent component data in the binding popover
      if (
        JSON.stringify(
          useEditorTreeStore.getState().relatedComponentsData[
            currentComponentGroupId
          ],
        ) !== JSON.stringify(data)
      ) {
        setRelatedComponentsData({ id: currentComponentGroupId, data });
      }

      return renderTree(child, {
        ...shareableContent,
        // if data is undefined, we don't want to overwrite the data passed by a parent that is sharing data
        ...(data && { data, parentSuffix }),
      });
    };

    if (initiallyLoading) {
      return <Skeleton mih={skeletonMinHeight} p="xl" />;
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
