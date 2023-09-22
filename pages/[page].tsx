import { Live } from "@/components/Live";
import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries";
import { PageResponse } from "@/requests/pages/types";
import { getByDomain } from "@/requests/projects/queries";
import { useEditorStore } from "@/stores/editor";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export function isMatchingUrl(url: string): boolean {
  const pattern = /^.*\.dexla\.io$/;
  return pattern.test(url);
}

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host;

  let id = "";
  if (isMatchingUrl(url!) || url?.endsWith(".localhost:3000")) {
    id = url?.split(".")[0] as string;
  } else {
    const project = await getByDomain(url!);
    id = project.id;
  }

  const page = await getMostRecentDeploymentByPage(id as string, {
    slug: query.page as string,
  });

  return {
    props: {
      id,
      page,
    },
  };
};

type Props = {
  id: string;
  page: PageResponse;
};

export default function LivePage({ id, page }: Props) {
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
      </Head>
      <Live key={page?.id} pageId={page?.id} projectId={id} />;
    </>
  );
}
