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
        return component.children?.map((child) =>
          renderTree(child, {
            ...shareableContent,
            data: item,
            parentIndex,
          }),
        );
      });
    } else {
      return component.children?.map((child) =>
        renderTree(child, merge({}, shareableContent, data ?? {})),
      );
    }
  };

  return {
    renderData,
  };
};
