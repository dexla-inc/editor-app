import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { prepareUserThemeLive } from "@/hooks/prepareUserThemeLive";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { DeploymentPage } from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { ProjectResponse } from "@/requests/projects/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { queryClient } from "@/utils/reactQuery";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { initializeFonts } from "@/utils/webfontloader";
import { dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";

export const getServerSideProps = async ({
  req,
  query,
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

  const currentSlug = query.page as string;
  const deploymentPage = await getDeploymentPage(project.id, currentSlug);

  await Promise.all([
    queryClient.prefetchQuery(["project", project.id], () =>
      Promise.resolve(project),
    ),
    queryClient.prefetchQuery(["endpoints", project.id], () =>
      getDataSourceEndpoints(project.id),
    ),
  ]);

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
        faviconUrl: project.faviconUrl,
        isLive: true,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: project.id,
      project,
      deploymentPage,
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

function LivePage({ project, faviconUrl, deploymentPage }: Props) {
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
}

export default withPageOnLoad(LivePage);
