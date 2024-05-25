"use client";

import Editor from "@/components/Editor";
import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { useVariableListQuery } from "@/hooks/editor/reactQuery/useVariableListQuery";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { LoadingOverlay } from "@mantine/core";
import UnauthorisedPage from "@/components/UnauthorisedPage";
import { PageProps } from "@/types/app";
import { useEffect, useState } from "react";
import { usePageQuery } from "@/hooks/editor/reactQuery/usePageQuery";
import useEditorHotkeysUndoRedo from "@/hooks/editor/useEditorHotkeysUndoRedo";

const PageEditor = ({ params: { id: projectId, page: pageId } }: PageProps) => {
  const initializeVariableList = useVariableStore(
    (state) => state.initializeVariableList,
  );
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );

  const [status, setStatus] = useState<
    "loading" | "unauthorised" | "authorised"
  >("loading");

  useEditorHotkeysUndoRedo();

  const { data: datasources } = useDataSources(projectId);
  const { data: variables } = useVariableListQuery(projectId);
  const checkHasAccess = usePropelAuthStore((state) => state.checkHasAccess);

  useEffect(() => {
    const hasAccess = checkHasAccess(projectId);
    if (hasAccess) {
      setStatus("authorised");
    } else {
      setStatus("unauthorised");
    }
  }, [projectId, checkHasAccess]);

  useEffect(() => {
    if (status === "authorised" && variables)
      initializeVariableList(variables.results);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, pageId, status]);

  useEffect(() => {
    if (datasources) {
      setApiAuthConfig(projectId, datasources);
    }
  }, [datasources, setApiAuthConfig, projectId]);

  const { data: editorPage } = usePageQuery(projectId, pageId);

  return status === "authorised" ? (
    <Editor page={editorPage!} projectId={projectId} pageId={pageId} />
  ) : status === "unauthorised" ? (
    <UnauthorisedPage />
  ) : (
    <LoadingOverlay visible={true} />
  );
};

export default PageEditor;
