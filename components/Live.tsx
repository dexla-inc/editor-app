// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { EditableComponent } from "@/components/EditableComponent";
import { LiveWrapper } from "@/components/LiveWrapper";
import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries-noauth";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { Component } from "@/utils/editor";
import { Box } from "@mantine/core";
import { useCallback, useEffect } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

const EditableComponentContainer = ({ children, component }: any) => {
  return (
    <EditableComponent id={component.id!} component={component}>
      {children}
    </EditableComponent>
  );
};

export const Live = ({ projectId, pageId }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  useEffect(() => {
    const getPageData = async () => {
      setIsLoading(true);
      const page = await getMostRecentDeploymentByPage(projectId as string, {
        page: pageId,
      });
      if (page.pageState) {
        const decodedSchema = decodeSchema(page.pageState);
        const state = JSON.parse(decodedSchema);
        setEditorTree(state, {
          onLoad: true,
          action: "Initial State",
        });
        setIsLoading(false);
      }
    };

    if (projectId && pageId) {
      getPageData();
    }
  }, [projectId, pageId, setEditorTree, setIsLoading]);

  const renderTree = useCallback((component: Component) => {
    if (component.id === "root") {
      return (
        <Box
          w="100%"
          display="flex"
          m={0}
          p={0}
          sx={{ flexDirection: "column" }}
          key={component.id}
        >
          {component.children?.map((child) => renderTree(child))}
        </Box>
      );
    }

    const componentToRender = componentMapper[component.name];

    return (
      <EditableComponentContainer key={component.id} component={component}>
        {componentToRender?.Component({ component, renderTree })}
      </EditableComponentContainer>
    );
  }, []);

  if ((editorTree.root?.children ?? [])?.length === 0 || isLoading) {
    return null;
  }

  return (
    <Box
      pos="relative"
      style={{
        minHeight: `100vh`,
      }}
      p={0}
    >
      <LiveWrapper projectId={projectId}>
        {renderTree(editorTree.root)}
      </LiveWrapper>
    </Box>
  );
};
