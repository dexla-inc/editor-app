import { EditableComponent } from "@/components/EditableComponent";
import { LiveWrapper } from "@/components/LiveWrapper";
import { DeploymentPage } from "@/requests/deployments/types";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { ComponentTree } from "@/utils/editor";
import { Box } from "@mantine/core";
import { ReactNode, useCallback, useEffect, useMemo } from "react";

type Props = {
  projectId: string;
  deploymentPage: DeploymentPage;
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

export const Live = ({ projectId, deploymentPage }: Props) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  useEffect(() => {
    if (deploymentPage?.pageState) {
      const decodedSchema = decodeSchema(deploymentPage.pageState);
      const state = JSON.parse(decodedSchema);
      setEditorTree(state, {
        onLoad: true,
        action: "Initial State",
      });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deploymentPage]);

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
        useEditorTreeStore.getState().componentMutableAttrs[componentTree.id!];
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
