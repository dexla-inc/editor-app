import { LiveWrapper } from "@/components/LiveWrapper";
import { useAppStore } from "@/stores/app";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { ComponentTree } from "@/utils/editor";
import { Box } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { RenderTreeFunc } from "@/types/component";
import { prepareUserThemeLive } from "@/utils/prepareUserThemeLive";
import { DeploymentPage } from "@/requests/deployments/types";
import { ProjectResponse } from "@/requests/projects/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { useVariableStore } from "@/stores/variables";
import { initializeFonts } from "@/utils/webfontloader";
import { useEffect } from "react";
import { useVariableListQuery } from "@/hooks/editor/reactQuery/useVariableListQuery";
import { useDataSourceEndpoints } from "@/hooks/editor/reactQuery/useDataSourceEndpoints";
import { MantineThemeExtended } from "@/utils/types";

type Props = {
  project: ProjectResponse;
  deploymentPage: DeploymentPage;
};

let theme: MantineThemeExtended | undefined;

export const Live = ({ project, deploymentPage }: Props) => {
  theme = theme === undefined ? prepareUserThemeLive(project.branding) : theme;

  const { data: variables } = useVariableListQuery(project.id);
  const { data: endpoints } = useDataSourceEndpoints(project.id);

  const editorTree = useEditorTreeStore((state) => state.tree);
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isLoading = useAppStore((state) => state.isLoading);
  const initializeVariableList = useVariableStore(
    (state) => state.initializeVariableList,
  );
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );
  const setIsLive = useEditorTreeStore((state) => state.setIsLive);
  const setCurrentPageAndProjectIds = useEditorTreeStore(
    (state) => state.setCurrentPageAndProjectIds,
  );
  const setPreviewMode = useEditorTreeStore((state) => state.setPreviewMode);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (theme) setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (project && deploymentPage.id) {
      setCurrentPageAndProjectIds(project.id, deploymentPage.id);
      setPreviewMode(true);
      setIsLive(true);

      const loadFonts = async () => {
        if (theme)
          await initializeFonts(theme.fontFamily, theme.headings.fontFamily);
      };

      loadFonts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, deploymentPage.id]);

  useEffect(() => {
    if (variables) initializeVariableList(variables.results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, deploymentPage.id]); // deploymentpage.id is used to reinitialize non global variables

  useEffect(() => {
    if (endpoints) {
      setApiAuthConfig(endpoints.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints]);

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
