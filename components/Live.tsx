// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { EditableComponent } from "@/components/EditableComponent";
import { LiveWrapper } from "@/components/LiveWrapper";
import { useDeploymentsRecentQuery } from "@/hooks/reactQuery/useDeploymentsRecentQuery";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { Component, ComponentTree } from "@/utils/editor";
import { Box } from "@mantine/core";
import { ReactNode, useCallback, useEffect, useMemo } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

type EditableComponentContainerProps = {
  children: ReactNode;
  componentTree: ComponentTree;
  shareableContent: any;
};

const EditableComponentContainer = ({
  children,
  componentTree,
  shareableContent,
}: EditableComponentContainerProps) => {
  return (
    <EditableComponent
      id={componentTree.id!}
      component={componentTree}
      shareableContent={shareableContent}
    >
      {children}
    </EditableComponent>
  );
};

export const Live = ({ projectId, pageId }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isLoading = useAppStore((state) => state.isLoading);
  const { data: deployment } = useDeploymentsRecentQuery(projectId);

  const page = useMemo(
    () => deployment?.pages?.find((p) => p.id === pageId),
    [deployment, pageId],
  );

  useEffect(() => {
    if (page?.pageState) {
      const decodedSchema = decodeSchema(page.pageState);
      const state = JSON.parse(decodedSchema);
      setEditorTree(state, {
        onLoad: true,
        action: "Initial State",
      });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const renderTree = useCallback(
    (componentTree: ComponentTree, shareableContent = {}) => {
      if (componentTree.id === "root") {
        return (
          <Box
            w="100%"
            display="flex"
            m={0}
            p={0}
            sx={{ flexDirection: "column" }}
            key={componentTree.id}
          >
            {componentTree.children?.map((child) => renderTree(child))}
          </Box>
        );
      }

      const component =
        useEditorStore.getState().componentMutableAttrs[componentTree.id!];
      const componentToRender = componentMapper[component.name];

      return (
        <EditableComponentContainer
          key={component.id}
          componentTree={componentTree}
          shareableContent={shareableContent}
        >
          {componentToRender?.Component({ component, renderTree })}
        </EditableComponentContainer>
      );
    },
    [],
  );

  if ((editorTree.root?.children ?? [])?.length === 0 || isLoading) {
    return null;
  }

  return (
    <LiveWrapper projectId={projectId}>
      {renderTree(editorTree.root)}
    </LiveWrapper>
  );
};
