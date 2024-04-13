import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { memo, useEffect } from "react";
import { useVariableStore } from "@/stores/variables";
import { dehydrate } from "@tanstack/react-query";
import { getProject } from "@/requests/projects/queries-noauth";
import { getPageList, getPageState } from "@/requests/pages/queries-noauth";
import { queryClient } from "@/utils/reactQuery";
import { ProjectResponse } from "@/requests/projects/types";
import { useDataSourceStore } from "@/stores/datasource";
import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { PageResponse } from "@/requests/pages/types";
import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useRouter } from "next/router";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  // const pageLoadTimestamp = Date.now();

  // const [project, pages, pageState, logicFlows] =
  //   await Promise.all([
  //     getProject(projectId, true),
  //     getPageList(projectId),
  //     getPageState(projectId, pageId, pageLoadTimestamp, null),
  //     listLogicFlows(projectId),
  //   ]);

  // await Promise.all([
  //   queryClient.prefetchQuery(["project", projectId], () =>
  //     Promise.resolve(project),
  //   ),
  //   queryClient.prefetchQuery(["pages", projectId, null], () =>
  //     Promise.resolve(pages),
  //   ),
  //   queryClient.prefetchQuery(
  //     ["page-state", projectId, pageId, pageLoadTimestamp, null],
  //     () => Promise.resolve(pageState),
  //   ),
  //   queryClient.prefetchQuery(["logic-flows", project.id], () =>
  //     Promise.resolve(logicFlows),
  //   ),
  // ]);

  // return {
  //   props: {
  //     dehydratedState: dehydrate(queryClient),
  //     project,
  //     page: pageId,
  //     deploymentPage: pages.results.find((page) => page.id === pageId),
  //     isLive: false,
  //   },
  // };

  return { props: {} };
};

// type Props = {
//   project: ProjectResponse;
//   page: string;
//   deploymentPage: PageResponse;
// };

const PageEditor = () => {
  const router = useRouter();
  const { id: projectId, page: pageId } = router.query as {
    id: string;
    page: string;
  };
  const initializeVariableList = useVariableStore(
    (state) => state.initializeVariableList,
  );
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );
  const { data: variables } = useVariableListQuery(projectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  useEffect(() => {
    if (variables) {
      initializeVariableList(variables.results);
    }
  }, [variables, initializeVariableList]);

  useEffect(() => {
    if (endpoints) {
      setApiAuthConfig(endpoints.results);
    }
  }, [endpoints, setApiAuthConfig]);

  return <Editor pageId={pageId} projectId={projectId} />;
};

export default withPageOnLoad(memo(PageEditor));
