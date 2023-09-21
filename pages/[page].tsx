import { Live } from "@/components/Live";
import { getPageBySlug } from "@/requests/pages/queries";
import { PageResponse } from "@/requests/pages/types";
import { getByDomain, getProject } from "@/requests/projects/queries";
import { useEditorStore } from "@/stores/editor";
import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import { useEffect } from "react";

function isMatchingUrl(url: string): boolean {
  const pattern = /^.*\.dexla\.io$/;
  return pattern.test(url);
}

function buildBaseUrl(project: any, url: string): string {
  if (project.id) {
    return project.subDomain
      ? `${project.subDomain}.${project.domain}`
      : project.domain;
  }
  return url;
}

async function fetchProjectByUrl(url: string): Promise<any> {
  if (url?.endsWith(".localhost:3000")) {
    const id = url.split(".")[0];
    return await getProject(id);
  }
  return await getByDomain(url);
}

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host;

  let shouldRedirect = false;
  let id = "";
  let project;
  if (url?.endsWith(".localhost:3000") || isMatchingUrl(url!)) {
    id = url?.split(".")[0] as string;
    project = await getProject(id);
  }
  if (!project?.id) {
    project = await getByDomain(url!);
    shouldRedirect = project.domain ? true : false;
    id = id ?? project.id;
  }

  const baseUrl = buildBaseUrl(project, url!);
  const page = await getPageBySlug(id as string, query.page as string);

  var result: GetStaticPropsResult<Props> = {
    props: {
      id,
      page,
    },
  };

  if (shouldRedirect) {
    result = {
      redirect: {
        destination: `https://${baseUrl}${req.url}`,
        permanent: false,
      },
    };
  }

  return result;
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
