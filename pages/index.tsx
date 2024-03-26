import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import {
  DeploymentPage,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { dehydrate } from "@tanstack/react-query";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { queryClient } from "@/utils/reactQuery";
import { ProjectResponse } from "@/requests/projects/types";
import { prepareUserThemeLive } from "@/hooks/prepareUserThemeLive";
import { useThemeStore } from "@/stores/theme";
import { initializeFonts } from "@/utils/webfontloader";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  const project = await getProject(url, true);

  if (!project.id) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
        isLive: false,
      },
    };
  }

  await queryClient.prefetchQuery(["project", project.id], () =>
    Promise.resolve(project),
  );
  const prefetchEndpoints = queryClient.prefetchQuery(
    ["endpoints", project.id],
    () => getDataSourceEndpoints(project.id),
  );
  const prefetchProject = queryClient.prefetchQuery(
    ["project", project.id],
    () => Promise.resolve(project),
  );
  const currentSlug = "/";
  const deploymentPage = await getDeploymentPage(project.id, currentSlug);

  await Promise.all([prefetchEndpoints, prefetchProject]);

  const isLoggedIn = checkRefreshTokenExists(req.cookies["refreshToken"]);

  if (
    !isLoggedIn &&
    deploymentPage?.authenticatedOnly &&
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
        deploymentPage,
        faviconUrl: project.faviconUrl,
        isLive: true,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: project.id,
      faviconUrl: project.faviconUrl,
      isLive: true,
    },
  };
};

type Props = {
  project: ProjectResponse;
  faviconUrl?: string;
  deploymentPage: DeploymentPage;
};

const HomePage = ({ project, faviconUrl, deploymentPage }: Props) => {
  const setCurrentPageAndProjectIds =
    useEditorTreeStore.getState().setCurrentPageAndProjectIds;
  const setPreviewMode = useEditorTreeStore.getState().setPreviewMode;
  const setIsLive = useEditorTreeStore.getState().setIsLive;
  const theme = prepareUserThemeLive(project);

  useEffect(() => {
    if (project && deploymentPage.id) {
      useThemeStore.getState().setTheme(theme);
      setCurrentPageAndProjectIds(project.id, deploymentPage.id);
      setPreviewMode(true);
      setIsLive(true);

      const loadFonts = async () => {
        await initializeFonts();
      };

      loadFonts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, deploymentPage.id]);

  return (
    <>
      <Head>
        <title>{deploymentPage.title}</title>
        <meta name="description" content={deploymentPage.title} />
        <link
          rel="icon"
          type="image/x-icon"
          href={faviconUrl ?? "/favicon.ico"}
        />
      </Head>
      <Live project={project} deploymentPage={deploymentPage} />
    </>
  );
};

export default withPageOnLoad(HomePage);
