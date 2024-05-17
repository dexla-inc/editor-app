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
import { Stopwatch } from "@/utils/stopwatch";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const url = req.headers.host as string;
  const currentSlug = "/";
  const timer = Stopwatch.StartNew();
  console.log(
    "Before getDeploymentPage",
    timer.getElapsedMilliseconds(),
    url,
    currentSlug,
  );
  const deploymentPage = await getDeploymentPage(url, currentSlug);
  console.log(
    "After getDeploymentPage",
    timer.getElapsedMilliseconds(),
    url,
    currentSlug,
    `trackingId: ${deploymentPage.trackingId}`,
  );

  if (!deploymentPage.projectId) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
        isLive: false,
      },
    };
  }

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
      },
    };
  }

  // Check if user is logged in
  const cookie = req.cookies[deploymentPage.projectId];
  const isLoggedIn = checkRefreshTokenExists(cookie);
  const signInPageSlug = deploymentPage.project.redirects?.signInPageId;
  console.log(
    "After signInPageSlug",
    timer.getElapsedMilliseconds(),
    `trackingId: ${deploymentPage.trackingId}`,
  );

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
        isLive: true,
        deploymentPage,
      },
    };
  }
  console.log(
    "Before entering app",
    timer.getElapsedMilliseconds(),
    `trackingId: ${deploymentPage.trackingId}`,
  );
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

const HomePage = ({ deploymentPage }: Props) => {
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
};

export default withPageOnLoad(HomePage, { isLive: true });
