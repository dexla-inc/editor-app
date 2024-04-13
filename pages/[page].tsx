import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { DeploymentPage } from "@/requests/deployments/types";
import { getProject } from "@/requests/projects/queries-noauth";
import { ProjectResponse } from "@/requests/projects/types";
import { queryClient } from "@/utils/reactQuery";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

// TODO: Backend changes so we only make one API call or two light API calls for getting project and deployment page.
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

  const [deploymentPage] = await Promise.all([
    getDeploymentPage(project.id, currentSlug),
    queryClient.prefetchQuery(["project", project.id], () =>
      Promise.resolve(project),
    ),
  ]);

  const isLoggedIn = checkRefreshTokenExists(req.cookies["refreshToken"]);

  console.log("deploymentPage", deploymentPage.slug);

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
        faviconUrl: project.faviconUrl,
        isLive: true,
        project,
        deploymentPage,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isLive: true,
      project,
      deploymentPage,
      faviconUrl: project.faviconUrl,
    },
  };
};

type Props = {
  project: ProjectResponse;
  faviconUrl?: string;
  deploymentPage: DeploymentPage;
};

function LivePage({ project, faviconUrl, deploymentPage }: Props) {
  console.log("LivePage", deploymentPage.slug);
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
