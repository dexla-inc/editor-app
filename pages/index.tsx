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
  const isLoggedIn = checkRefreshTokenExists(req.cookies["dexlaRefreshToken"]);
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
        isLive: true,
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
