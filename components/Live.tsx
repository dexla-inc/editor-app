"use client";

import { LiveWrapper } from "@/components/LiveWrapper";
import { componentMapper } from "@/utils/componentMapper";
import { ComponentTree, EditorTreeCopy } from "@/utils/editor";
import { Box } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { RenderTreeFunc } from "@/types/component";
import { prepareUserThemeLive } from "@/utils/prepareUserThemeLive";
import { DeploymentPage } from "@/requests/deployments/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { useVariableStore } from "@/stores/variables";
import { initializeFonts } from "@/utils/webfontloader";
import { useEffect } from "react";
import { MantineThemeExtended } from "@/types/types";
import { useInputsStore } from "@/stores/inputs";
import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { useVariableListQuery } from "@/hooks/editor/reactQuery/useVariableListQuery";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";

type Props = {
  page: DeploymentPage;
  pageState: EditorTreeCopy;
};

//let theme: MantineThemeExtended | undefined;

export const LiveComponent = ({ page, pageState }: Props) => {
  const theme = useMemo(
    () => prepareUserThemeLive(page.branding),
    [page.branding],
  );

  const projectId = page.project.id;

  const { data: datasources } = useDataSources(projectId);
  const { data: variables } = useVariableListQuery(projectId);

  const editorTree = useEditorTreeStore((state) => state.tree);
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const initializeVariableList = useVariableStore(
    (state) => state.initializeVariableList,
  );
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );
  const setTheme = useThemeStore((state) => state.setTheme);
  const resetInputValues = useInputsStore((state) => state.resetInputValues);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (theme) setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme?.fontFamily && theme?.headings?.fontFamily) {
      initializeFonts(theme.fontFamily, theme.headings.fontFamily);
    }
  }, [theme]);

  useEffect(() => {
    if (variables) initializeVariableList(variables.results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, page.id]);

  useEffect(() => {
    if (datasources) {
      setApiAuthConfig(projectId, datasources);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasources]);

  useEffect(() => {
    if (page.id && projectId && pageState && isLoading) {
      useEditorTreeStore.setState(
        {
          currentPageId: page.id,
          currentProjectId: projectId,
          isLive: true,
          isPreviewMode: true,
        },
        false,
        "editorTree/setStartUp",
      );

      setEditorTree(pageState, {
        onLoad: true,
        action: "Initial State",
      });
      setIsLoading(false);

      resetInputValues();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, page.id, pageState, isLoading]);

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
    <LiveWrapper project={page.project}>
      {renderTree(editorTree.root)}
    </LiveWrapper>
  );
};

export const Live = withPageOnLoad<Props>(LiveComponent);
