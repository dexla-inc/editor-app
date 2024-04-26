import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { Component, ComponentTree } from "@/utils/editor";
import { useEndpoint } from "@/hooks/useEndpoint";
import { LoadingOverlay } from "@mantine/core";
import merge from "lodash.merge";

type UseRenderDataProps = {
  component: Component & ComponentTree;
};

type RenderDataProps = {
  renderTree: any;
  shareableContent: any;
};

export const useRenderData = ({ component }: UseRenderDataProps) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const { dataType = "static" } = component?.props!;
  const { data: staticData } = component.onLoad!;

  const { data: dynamicData, isLoading } = useEndpoint({
    onLoad: component.onLoad,
    dataType,
    includeExampleResponse: !isPreviewMode,
  });

  const data = dataType === "dynamic" ? dynamicData : staticData;

  const renderData = ({ renderTree, shareableContent }: RenderDataProps) => {
    if (isLoading) {
      return <LoadingOverlay visible overlayBlur={2} />;
    }

    if (Array.isArray(data)) {
      return data.map((item: any, parentIndex: number) => {
        return component.children?.map((child) => {
          const currentComponentGroupId = `${component.id}__${parentIndex}`;
          let newParentSuffix = currentComponentGroupId;
          if (shareableContent?.parentSuffix) {
            newParentSuffix = `${shareableContent.parentSuffix}--${component.id}__${parentIndex}`;
          }
          return renderTree(child, {
            ...shareableContent,
            data: item,
            parentSuffix: newParentSuffix,
            relatedComponentsData: {
              ...(shareableContent?.relatedComponentsData ?? {}),
              [currentComponentGroupId]: item,
            },
          });
        });
      });
    } else {
      return component.children?.map((child) => {
        let newParentSuffix;
        if (shareableContent?.data) {
          const currentComponentGroupId = `${component.id}`;
          newParentSuffix = currentComponentGroupId;
          if (shareableContent?.parentSuffix) {
            newParentSuffix = `${shareableContent.parentSuffix}--${newParentSuffix}`;
          }
        }
        console.log(newParentSuffix);
        return renderTree(
          child,
          merge({}, shareableContent, {
            data: data ?? {},
            ...(newParentSuffix ? { parentSuffix: newParentSuffix } : {}),
          }),
        );
      });
    }
  };

  return {
    renderData,
  };
};
