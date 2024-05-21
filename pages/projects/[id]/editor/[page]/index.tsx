import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { useRouter } from "next/router";
import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { LoadingOverlay } from "@mantine/core";
import UnauthorisedPage from "@/components/UnauthorisedPage";

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

  const [status, setStatus] = useState<
    "loading" | "unauthorised" | "authorised"
  >("loading");

  const { data: datasources } = useDataSources(projectId);
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
    if (status === "authorised") initializeVariableList(projectId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, pageId, status]); // DO NOT REMOVE: pageId is used to reinitialize non global variables

  useEffect(() => {
    if (datasources) {
      setApiAuthConfig(projectId, datasources);
    }
  }, [datasources, setApiAuthConfig, projectId]);

  return status === "authorised" ? (
    <Editor projectId={projectId} pageId={pageId} />
  ) : status === "unauthorised" ? (
    <UnauthorisedPage />
  ) : (
    <LoadingOverlay visible={true} />
  );
};

export default withPageOnLoad(PageEditor, { isLive: false });
