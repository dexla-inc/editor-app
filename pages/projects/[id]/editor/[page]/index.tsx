import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { memo } from "react";
import { listVariables } from "@/requests/variables/queries-noauth";
import { useVariableStore } from "@/stores/variables";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { dehydrate, QueryClient } from "@tanstack/react-query";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();

  const variables = await listVariables(query.id as string);
  await queryClient.prefetchQuery(["endpoints", query.id], () =>
    getDataSourceEndpoints(query.id as string),
  );
  dehydrate(queryClient);
  // await fetch("http://localhost:3000/api/proxyTest");

  return {
    props: {
      id: query.id,
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
