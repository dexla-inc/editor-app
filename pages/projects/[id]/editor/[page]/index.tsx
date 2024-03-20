import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { memo } from "react";
import { listVariables } from "@/requests/variables/queries-noauth";
import { useVariableStore } from "@/stores/variables";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getProject } from "@/requests/projects/queries-noauth";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const projectId = query.id as string;

  const variables = await listVariables(projectId);
  await queryClient.prefetchQuery(["endpoints", projectId], () =>
    getDataSourceEndpoints(projectId),
  );
  await queryClient.prefetchQuery(["project", projectId], () =>
    getProject(projectId, true),
  );

  // await fetch("http://localhost:3000/api/proxyTest");

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: projectId,
      page: query.page,
      variables: variables.results,
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
