import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries-noauth";

function checkRefreshTokenExists(refreshToken: string | undefined) {
  if (!refreshToken || refreshToken.toString() === "undefined") {
    return false;
  }

  return true;
}

export async function getPageProps(
  id: string,
  querySlug: string,
  redirectSlug?: string,
  refreshToken?: string,
  faviconUrl?: string,
) {
  const isLoggedIn = checkRefreshTokenExists(refreshToken);
  let page = await getMostRecentDeploymentByPage(id, {
    page: querySlug,
  });

  if (!isLoggedIn && page.authenticatedOnly) {
    if (redirectSlug && querySlug !== redirectSlug) {
      page = await getMostRecentDeploymentByPage(id, {
        page: redirectSlug,
      });

      return {
        redirect: {
          destination: `/${redirectSlug}`.replace("//", "/"),
          permanent: false,
        },
        props: {
          id,
          page,
          faviconUrl,
        },
      };
    }
  }

  return {
    props: {
      id,
      page,
      faviconUrl,
    },
  };
}
