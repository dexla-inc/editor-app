import { Live } from "@/components/Live";
import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries-noauth";
import { PageResponse } from "@/requests/pages/types";
import { getByDomain } from "@/requests/projects/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export function isMatchingUrl(url: string): boolean {
  // check if url follow the pattern: 7eacfa0cbb8b406cbc2b40085b9c37a4.dexla.io or 7eacfa0cbb8b406cbc2b40085b9c37a4.dexla.ai
  // where 7eacfa0cbb8b406cbc2b40085b9c37a4 is the project id and can be any string that contains only letters and numbers,
  // but always has 32 characters and a mix of letters and numbers
  const pattern = new RegExp(
    "^[a-zA-Z0-9]{32}\\.dexla\\.(io|ai|localhost:3000)$",
  );
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
    page: query.page as string,
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
      <Live key={page?.id} pageId={page?.id} projectId={id} />
    </>
  );
}
