import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { memo } from "react";
import { listVariables } from "@/requests/variables/queries-noauth";
import { useVariableStore } from "@/stores/variables";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { dehydrate } from "@tanstack/react-query";
import { getProject } from "@/requests/projects/queries-noauth";
import { getPageList, getPageState } from "@/requests/pages/queries-noauth";
import { queryClient } from "@/utils/reactQuery";
import { ProjectResponse } from "@/requests/projects/types";
import { useThemeStore } from "@/stores/theme";
import { prepareUserThemeLive } from "@/hooks/prepareUserThemeLive";
import { Endpoint } from "@/requests/datasources/types";
import { useDataSourceStore } from "@/stores/datasource";
import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { PageResponse } from "@/requests/pages/types";
import { LogicFlowResponse } from "@/requests/logicflows/types";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { id: projectId, page: pageId } = query as { id: string; page: string };
  const pageLoadTimestamp = Date.now();

  const [project, pages, variables, endpoints, pageState, logicFlows] =
    await Promise.all([
      getProject(projectId, true),
      getPageList(projectId),
      listVariables(projectId),
      getDataSourceEndpoints(projectId),
      getPageState(projectId, pageId, pageLoadTimestamp, null),
      listLogicFlows(projectId),
    ]);

  await Promise.all([
    queryClient.prefetchQuery(["project", projectId], () =>
      Promise.resolve(project),
    ),
    queryClient.prefetchQuery(["pages", projectId, null], () =>
      Promise.resolve(pages),
    ),
    queryClient.fetchQuery(["endpoints", projectId], () =>
      Promise.resolve(endpoints),
    ),
    queryClient.prefetchQuery(
      ["page-state", projectId, pageId, pageLoadTimestamp, null],
      () => Promise.resolve(pageState),
    ),
    queryClient.fetchQuery(["logic-flows", project.id], () =>
      Promise.resolve(logicFlows),
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      project,
      page: pageId,
      deploymentPage: pages.results.find((page) => page.id === pageId),
      isLive: false,
      variables: variables.results,
      endpoints: endpoints.results || [],
      logicFlows: logicFlows.results,
    },
  };
};

type Props = {
  project: ProjectResponse;
  page: string;
  variables: any[];
  endpoints: Endpoint[];
  deploymentPage: PageResponse;
  logicFlows: LogicFlowResponse[];
};

const PageEditor = ({ project, page, variables, endpoints }: Props) => {
  useVariableStore.getState().initializeVariableList(variables);
  const theme = prepareUserThemeLive(project);
  useThemeStore.getState().setTheme(theme);

  if (endpoints) useDataSourceStore.getState().setApiAuthConfig(endpoints);

  return <Editor key={page} pageId={page} projectId={project.id} />;
};

export default withPageOnLoad(memo(PageEditor));
