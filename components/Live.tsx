import { LiveWrapper } from "@/components/LiveWrapper";
import { DeploymentPage } from "@/requests/deployments/types";
import { ProjectResponse } from "@/requests/projects/types";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { ComponentTree } from "@/utils/editor";
import { Box } from "@mantine/core";
import { useCallback, useEffect } from "react";
import { RenderTreeFunc } from "@/types/component";

type Props = {
  project: ProjectResponse;
  deploymentPage: DeploymentPage;
};

export const Live = ({ project, deploymentPage }: Props) => {
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

  const renderTree: RenderTreeFunc = useCallback(
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
            {componentTree.children?.map((child) =>
              renderTree(child, shareableContent),
            )}
          </Box>
        );
      }

      const componentToRender = componentMapper[componentTree.name];

      if (!componentToRender) {
        return componentTree.children?.map((child) =>
          renderTree(child, shareableContent),
        );
      }

      return componentToRender?.Component({
        component: componentTree,
        renderTree,
        shareableContent,
      });
    },
    [],
  );

  if ((editorTree.root?.children ?? [])?.length === 0 || isLoading) {
    return null;
  }

  return (
    <LiveWrapper project={project}>{renderTree(editorTree.root)}</LiveWrapper>
  );
};
