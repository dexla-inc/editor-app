import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { useRouter } from "next/router";
import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";

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

  const { data: datasources } = useDataSources(projectId);

  useEffect(() => {
    initializeVariableList(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, pageId]); // DO NOT REMOVE: pageId is used to reinitialize non global variables

  useEffect(() => {
    if (datasources) {
      setApiAuthConfig(projectId, datasources);
    }
  }, [datasources, setApiAuthConfig, projectId]);

  return <Editor pageId={pageId} projectId={projectId} />;
};

export default withPageOnLoad(PageEditor, { isLive: false });
