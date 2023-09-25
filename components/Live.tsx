// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { IFrame } from "@/components/IFrame";
import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { Component } from "@/utils/editor";
import { Box, Paper } from "@mantine/core";
import { useEffect } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const Live = ({ projectId, pageId }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  useEffect(() => {
    const getPageData = async () => {
      setIsLoading(true);
      const page = await getMostRecentDeploymentByPage(projectId as string, {
        pageId,
      });
      if (page.pageState) {
        const decodedSchema = decodeSchema(page.pageState);
        setEditorTree(JSON.parse(decodedSchema), {
          onLoad: true,
          action: "Initial State",
        });
        setIsLoading(false);
      }
    };

    if (projectId && pageId) {
      getPageData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, pageId, setEditorTree, setIsLoading]);

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable
          key={`${component.id}-preview`}
          id={component.id}
          m={0}
          p={0}
          w="100%"
        >
          <Paper shadow="xs" bg="gray.0" display="flex" w="100%">
            {component.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={`${component.id}-${component?.props?.key}-preview`}
          id={component.id!}
          component={component}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        key={`${component.id}-${component?.props?.key}-preview`}
        id={component.id!}
        component={component}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
    );
  };

  return (editorTree?.root?.children ?? [])?.length > 0 ? (
    <Box
      pos="relative"
      style={{
        minHeight: `100vh`,
      }}
      p={0}
    >
      <IFrame projectId={projectId} isLive>
        {renderTree(editorTree.root)}
      </IFrame>
    </Box>
  ) : null;
};
