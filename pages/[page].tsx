import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { getMostRecentDeployment } from "@/requests/deployments/queries-noauth";
import {
  DeploymentPage,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { useEditorTreeStore } from "@/stores/editorTree";
import { queryClient } from "@/utils/reactQuery";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  console.log("url", url);

  const project = await getProject(url, true);
  console.log("project", project);

  const deploymentPromise = getMostRecentDeployment(project.id);

  await Promise.all([
    queryClient.prefetchQuery(["project", project.id], () =>
      Promise.resolve(project),
    ),
    queryClient.prefetchQuery(["endpoints", project.id], () =>
      getDataSourceEndpoints(project.id),
    ),
    deploymentPromise.then((deployment) =>
      queryClient.prefetchQuery(["deployments", project.id], () =>
        Promise.resolve(deployment),
      ),
    ),
  ]);

  const deployment = await deploymentPromise;

  const isLoggedIn = checkRefreshTokenExists(req.cookies["refreshToken"]);
  const currentSlug = query.page;
  const page = deployment.pages.find((page) => page.slug === currentSlug);

  if (
    !isLoggedIn &&
    page?.authenticatedOnly &&
    project.redirectSlug &&
    currentSlug !== project.redirectSlug
  ) {
    return {
      redirect: {
        destination: `/${project.redirectSlug}`.replace("//", "/"),
        permanent: false,
      },
      props: {
        dehydratedState: dehydrate(queryClient),
        id: project.id,
        page,
        faviconUrl: project.faviconUrl,
        isLive: true,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: project.id,
      page,
      deployment,
      faviconUrl: project.faviconUrl,
      isLive: true,
    },
  };
};

type Props = {
  id: string;
  page: DeploymentPage;
  faviconUrl?: string;
  deployment: DeploymentResponse;
};

function LivePage({ id, page, faviconUrl, deployment }: Props) {
  console.log("Live", id, page, faviconUrl, deployment);
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
      <Live pageId={page.id} projectId={id} deployment={deployment} />
    </>
  );
}

export default withPageOnLoad(LivePage);
