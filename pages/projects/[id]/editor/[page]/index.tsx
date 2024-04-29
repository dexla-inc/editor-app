import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { memo, useEffect } from "react";
import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useRouter } from "next/router";

export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
  return { props: {} };
};

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

export default withPageOnLoad(PageEditor, { isLive: false });
