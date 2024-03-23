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

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { id: projectId, page: pageId } = query as { id: string; page: string };
  const pageLoadTimestamp = Date.now();

  const variables = await listVariables(projectId);
  await queryClient.prefetchQuery(["endpoints", projectId], () =>
    getDataSourceEndpoints(projectId),
  );
  await queryClient.prefetchQuery(["project", projectId], () =>
    getProject(projectId, true),
  );

  await queryClient.prefetchQuery(
    ["page-state", projectId, pageId, pageLoadTimestamp, null],
    () => getPageState(projectId, pageId, pageLoadTimestamp, null),
  );

  await queryClient.prefetchQuery(["pages", projectId, null], () =>
    getPageList(projectId),
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: projectId,
      page: pageId,
      variables: variables.results,
      isLive: false,
    },
  };
};

type Props = {
  id: string;
  page: string;
  variables: any[];
};

const PageEditor = ({ id, page, variables }: Props) => {
  useVariableStore.getState().initializeVariableList(variables);

  return <Editor key={page} pageId={page} projectId={id} />;
};

export default withPageOnLoad(memo(PageEditor));
