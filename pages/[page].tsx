import { Live } from "@/components/Live";
import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries-noauth";
import { PageResponse } from "@/requests/pages/types";
import { getByDomain, getProject } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { isAppUrl } from "@/utils/common";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host;
  let id = "",
    faviconUrl = "";
  const isLiveApp = isAppUrl(url!);
  if (isLiveApp) {
    id = url?.split(".")[0] as string;
    const project = await getProject(id);
    faviconUrl = project.faviconUrl ?? "";
  } else {
    const project = await getByDomain(url!);
    id = project.id;
    faviconUrl = project.faviconUrl ?? "";
  }

  const page = await getMostRecentDeploymentByPage(id as string, {
    page: query.page as string,
  });

  console.log("[page]]", isLiveApp);

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
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const setIsLive = useEditorStore((state) => state.setIsLive);

  useEffect(() => {
    if (id && page?.id) {
      setCurrentProjectId(id);
      setCurrentPageId(page.id);
      setPreviewMode(true);
      setIsLive(true);
    }
  }, [
    id,
    page?.id,
    setCurrentPageId,
    setCurrentProjectId,
    setPreviewMode,
    setIsLive,
  ]);

  return (
    <>
      <Head>
        <title>{page?.title}</title>
        <meta name="description" content={page.title} />
        <link
          rel="icon"
          type="image/x-icon"
          href={faviconUrl ?? "/favicon.ico"}
        />
      </Head>
      <Live key={page?.id} pageId={page?.id} projectId={id} />
    </>
  );
}
