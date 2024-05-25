import { Live } from "@/components/Live";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { checkRefreshTokenExists } from "@/utils/serverside";
import { cookies, headers } from "next/headers";
import { PageProps } from "@/types/app";
import { decodeSchema } from "@/utils/compression";
import { safeJsonParse } from "@/utils/common";
import { redirect } from "next/navigation";
import { EditorTreeCopy } from "@/utils/editor";
import { Viewport } from "next";

export async function generateMetadata({ params: { page } }: PageProps) {
  if (page?.includes?.("_next")) {
    return {};
  }

  const url = headers().get("host") as string;
  const currentSlug = (page?.at(0) as string) ?? "/";
  const deploymentPage = await getDeploymentPage(url, currentSlug);

  return {
    title: deploymentPage.title,
    description: deploymentPage.title,
    icons: {
      icon: deploymentPage.project.faviconUrl ?? "/favicon.ico",
    },
  };
}

const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

async function LivePage({ params: { page } }: PageProps) {
  if (page?.includes?.("_next")) {
    return null;
  }

  const url = headers().get("host") as string;
  const currentSlug = (page?.at(0) as string) ?? "/";
  const deploymentPage = await getDeploymentPage(url, currentSlug);
  const cookie = cookies().get(deploymentPage.projectId);
  const isLoggedIn = checkRefreshTokenExists(cookie?.value);
  const signInPageSlug = deploymentPage.project.redirects?.signInPageId;

  if (!deploymentPage.projectId) {
    redirect("/projects");
  }

  const notFoundPageslug = deploymentPage.project.redirects?.notFoundPageId;
  if (!deploymentPage.id) {
    redirect(
      notFoundPageslug ? `/${notFoundPageslug}` : "https://dexla.ai/404",
    );
  }

  const decodedSchema = decodeSchema(deploymentPage.pageState);
  const pageState = safeJsonParse(decodedSchema) as EditorTreeCopy;

  if (
    !isLoggedIn &&
    deploymentPage?.authenticatedOnly &&
    signInPageSlug &&
    currentSlug !== signInPageSlug
  ) {
    redirect(`/${signInPageSlug}`.replace("//", "/"));
  }

  return (
    <Live
      page={deploymentPage}
      pageState={pageState}
      projectId={deploymentPage?.project?.id}
    />
  );
}

export default LivePage;
