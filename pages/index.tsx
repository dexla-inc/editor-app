import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { DeploymentPage } from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { getPageProps } from "@/utils/serverside";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { QueryClient, dehydrate } from "@tanstack/react-query";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  const project = await getProject(url, true);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["project", project.id], () =>
    Promise.resolve(project),
  );

  dehydrate(queryClient);

  if (!project.id) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  return getPageProps(
    project.id,
    "/",
    project.redirectSlug,
    req.cookies["refreshToken"],
    project.faviconUrl ?? "",
  );
};

type Props = {
  id: string;
  page: DeploymentPage;
  faviconUrl?: string;
};

const HomePage = ({ id, page, faviconUrl }: Props) => {
  const setCurrentPageAndProjectIds =
    useEditorTreeStore.getState().setCurrentPageAndProjectIds;
  const setPreviewMode = useEditorTreeStore.getState().setPreviewMode;
  const setIsLive = useEditorTreeStore.getState().setIsLive;

  useEffect(() => {
    if (id && page.id) {
      setCurrentPageAndProjectIds(id, page.id);
      setPreviewMode(true);
      setIsLive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page.id]);

  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.title} />
        <link
          rel="icon"
          type="image/x-icon"
          href={faviconUrl ?? "/favicon.ico"}
        />
      </Head>
      <Live pageId={page.id} projectId={id} />
    </>
  );
};

export default withPageOnLoad(HomePage);
