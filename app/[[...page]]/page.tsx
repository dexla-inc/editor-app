import { Live } from "@/components/Live";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { DeploymentPage } from "@/requests/deployments/types";
import { queryClient } from "@/utils/reactQuery";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { Stopwatch } from "@/utils/stopwatch";
import { dehydrate } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
// import Head from "next/head";
import { cookies, headers } from "next/headers";
import { PageProps } from "@/types/app";

// TODO: Backend changes so we only make one API call or two light API calls for getting project and deployment page.
// export const getServerSideProps = async ({
//   req,
//   query,
// }: GetServerSidePropsContext) => {
//   const url = req.headers.host as string;
//   const currentSlug = (query?.page as string) ?? "/";
//   const timer = Stopwatch.StartNew();
//   console.log(
//     "Before getDeploymentPage",
//     timer.getElapsedMilliseconds(),
//     url,
//     currentSlug,
//   );
//   const deploymentPage = await getDeploymentPage(url, currentSlug);
//   console.log(
//     "After getDeploymentPage",
//     timer.getElapsedMilliseconds(),
//     url,
//     currentSlug,
//     `trackingId: ${deploymentPage.trackingId}`,
//   );
//
//   if (!deploymentPage.projectId) {
//     return {
//       redirect: {
//         destination: "/projects",
//         permanent: false,
//         isLive: false,
//       },
//     };
//   }
//
//   //if(!deploymentPage.project)
//   // Redirect to dexla page to save it hasn't been deployed
//
//   const notFoundPageslug = deploymentPage.project.redirects?.notFoundPageId;
//
//   // Check if page exists
//   if (!deploymentPage.id) {
//     return {
//       redirect: {
//         destination: notFoundPageslug
//           ? `/${notFoundPageslug}`
//           : "https://dexla.ai/404",
//         permanent: false,
//       },
//       props: {
//         dehydratedState: dehydrate(queryClient),
//         isLive: true,
//         project: deploymentPage.project,
//       },
//     };
//   }
//
//   // Check if user is logged in via cookies
//   const cookie = req.cookies[deploymentPage.projectId];
//   const isLoggedIn = checkRefreshTokenExists(cookie);
//   const signInPageSlug = deploymentPage.project.redirects?.signInPageId;
//   console.log(
//     "After signInPageSlug",
//     timer.getElapsedMilliseconds(),
//     `trackingId: ${deploymentPage.trackingId}`,
//   );
//
//   if (
//     !isLoggedIn &&
//     deploymentPage?.authenticatedOnly &&
//     signInPageSlug &&
//     currentSlug !== signInPageSlug
//   ) {
//     return {
//       redirect: {
//         destination: `/${signInPageSlug}`.replace("//", "/"),
//         permanent: false,
//       },
//       props: {
//         dehydratedState: dehydrate(queryClient),
//         isLive: true,
//         deploymentPage,
//       },
//     };
//   }
//   console.log(
//     "Before entering app",
//     timer.getElapsedMilliseconds(),
//     `trackingId: ${deploymentPage.trackingId}`,
//   );
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//       isLive: true,
//       deploymentPage,
//     },
//   };
// };

type Props = {
  deploymentPage: DeploymentPage;
};

async function LivePage({ params: { page } }: PageProps) {
  const url = headers().get("host") as string;
  const currentSlug = (page?.at(0) as string) ?? "/";
  const deploymentPage = await getDeploymentPage(url, currentSlug);

  const cookie = cookies().get(deploymentPage.projectId);
  const isLoggedIn = checkRefreshTokenExists(cookie?.value);
  const signInPageSlug = deploymentPage.project.redirects?.signInPageId;

  // const dehydratedState = dehydrate(queryClient);

  return (
    <>
      {/*<Head>*/}
      {/*  <title>{deploymentPage.title}</title>*/}
      {/*  <meta name="description" content={deploymentPage.title} />*/}
      {/*  <link*/}
      {/*    rel="icon"*/}
      {/*    type="image/x-icon"*/}
      {/*    href={deploymentPage.project.faviconUrl ?? "/favicon.ico"}*/}
      {/*  />*/}
      {/*</Head>*/}
      <Live deploymentPage={deploymentPage} />
    </>
  );
}

// export default withPageOnLoad(LivePage, { isLive: true });
export default LivePage;
