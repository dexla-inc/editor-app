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

  //if(!deploymentPage.project)
  // Redirect to dexla page to save it hasn't been deployed

  const notFoundPageslug = deploymentPage.project.redirects?.notFoundPageId;
  // Check if page exists
  if (!deploymentPage.id) {
    return {
      redirect: {
        destination: notFoundPageslug
          ? `/${notFoundPageslug}`
          : "https://dexla.ai/404",
        permanent: false,
      },
      props: {
        dehydratedState: dehydrate(queryClient),
        isLive: true,
        project,
      },
    };
  }

  // Check if user is logged in via cookies
  const cookie = req.cookies[project.id];
  const isLoggedIn = checkRefreshTokenExists(cookie);
  const signInPageSlug = deploymentPage.project.redirects?.signInPageId;

  if (
    !isLoggedIn &&
    deploymentPage?.authenticatedOnly &&
    signInPageSlug &&
    currentSlug !== signInPageSlug
  ) {
    return {
      redirect: {
        destination: `/${signInPageSlug}`.replace("//", "/"),
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
      deploymentPage,
    },
  };
};

type Props = {
  deploymentPage: DeploymentPage;
};

function LivePage({ deploymentPage }: Props) {
  return (
    <>
      <Head>
        <title>{deploymentPage.title}</title>
        <meta name="description" content={deploymentPage.title} />
        <link
          rel="icon"
          type="image/x-icon"
          href={deploymentPage.project.faviconUrl ?? "/favicon.ico"}
        />
      </Head>
      <Live deploymentPage={deploymentPage} />
    </>
  );
}

export default withPageOnLoad(LivePage, { isLive: true });
