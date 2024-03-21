import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { DeploymentPage } from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getMostRecentDeployment } from "@/requests/deployments/queries-noauth";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  const project = await getProject(url, true);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["project", project.id], () =>
    Promise.resolve(project),
  );

  if (!project.id) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
        isLive: false,
      },
    };
  }

  const prefetchEndpoints = queryClient.prefetchQuery(
    ["endpoints", project.id],
    () => getDataSourceEndpoints(project.id),
  );
  const prefetchProject = queryClient.prefetchQuery(
    ["project", project.id],
    () => Promise.resolve(project),
  );
  const deploymentPromise = getMostRecentDeployment(project.id);
  const prefetchDeployments = deploymentPromise.then((deployment) =>
    queryClient.prefetchQuery(["deployments", project.id], () =>
      Promise.resolve(deployment),
    ),
  );

  await Promise.all([prefetchEndpoints, prefetchProject, prefetchDeployments]);
  const deployment = await deploymentPromise;

  const isLoggedIn = checkRefreshTokenExists(req.cookies["refreshToken"]);
  const currentSlug = "/";
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
      faviconUrl: project.faviconUrl,
      isLive: true,
    },
  };
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
