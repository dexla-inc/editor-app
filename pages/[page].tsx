import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { DeploymentPage } from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { useEditorTreeStore } from "@/stores/editorTree";
import { getPageProps } from "@/utils/serverside";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  console.log("url", url);
  console.log(
    "NEXT_PUBLIC_APPS_BASE_URL",
    process.env.NEXT_PUBLIC_APPS_BASE_URL,
  );

  const project = await getProject(url, true);

  const page = getPageProps(
    project.id,
    query.page as string,
    project.redirectSlug,
    req.cookies["refreshToken"],
    project.faviconUrl ?? "",
  );

  return page;
};

type Props = {
  id: string;
  page: DeploymentPage;
  faviconUrl?: string;
};

function LivePage({ id, page, faviconUrl }: Props) {
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
}

export default withPageOnLoad(LivePage);
