import { Live } from "@/components/Live";
import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries-noauth";
import { PageResponse } from "@/requests/pages/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  const project = await getProject(url, true);
  const id = project.id;
  const faviconUrl = project.faviconUrl ?? "";

  const page = await getMostRecentDeploymentByPage(id as string, {
    page: query.page as string,
  });

  return {
    props: {
      id,
      page,
      faviconUrl,
    },
  };
};

type Props = {
  id: string;
  page: PageResponse;
  faviconUrl?: string;
};

export default function LivePage({ id, page, faviconUrl }: Props) {
  console.log("LivePage");
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const setIsLive = useEditorStore((state) => state.setIsLive);

  useEffect(() => {
    if (id && page.id) {
      setCurrentProjectId(id);
      setCurrentPageId(page.id);
      setPreviewMode(true);
      setIsLive(true);
    }
  }, [
    id,
    page.id,
    setCurrentPageId,
    setCurrentProjectId,
    setPreviewMode,
    setIsLive,
  ]);

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
