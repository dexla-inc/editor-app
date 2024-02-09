import { Live } from "@/components/Live";
import { PageResponse } from "@/requests/pages/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { getPageProps } from "@/utils/serverside";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  const project = await getProject(url, true);
  const id = project.id as string;

  if (!id) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  return getPageProps(
    id,
    "/",
    project.redirectSlug,
    req.cookies["refreshToken"],
    project.faviconUrl ?? "",
  );
};

type Props = {
  id: string;
  page: PageResponse;
  faviconUrl?: string;
};

const HomePage = ({ id, page, faviconUrl }: Props) => {
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
      <Live pageId={page.id} projectId={id} />;
    </>
  );
};

export default withPageOnLoad(HomePage);
