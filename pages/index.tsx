import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { DeploymentPage } from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { dehydrate } from "@tanstack/react-query";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { queryClient } from "@/utils/reactQuery";
import { ProjectResponse } from "@/requests/projects/types";

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

  const currentSlug = "/";

  const [deploymentPage] = await Promise.all([
    getDeploymentPage(project.id, currentSlug),
    queryClient.prefetchQuery(["project", project.id], () =>
      Promise.resolve(project),
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
        project,
        faviconUrl: project.faviconUrl,
        isLive: true,
        deploymentPage,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      project,
      faviconUrl: project.faviconUrl,
      isLive: true,
      deploymentPage,
    },
  };
};

type Props = {
  project: ProjectResponse;
  faviconUrl?: string;
  deploymentPage: DeploymentPage;
};

const HomePage = ({ project, faviconUrl, deploymentPage }: Props) => {
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
