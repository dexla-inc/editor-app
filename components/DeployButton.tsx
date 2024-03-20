import { ActionIconDefault } from "@/components/ActionIconDefault";
import { Icon } from "@/components/Icon";
import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { createDeployment } from "@/requests/deployments/mutations";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Button, Tooltip } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const DeployButton = () => {
  const router = useRouter();
  const { id: projectId, page } = router.query as { id: string; page: string };

  const { data: pageListQuery, isFetched } = usePageListQuery(projectId, null);
  const setPages = useEditorStore((state) => state.setPages);

  const { startLoading, stopLoading, isLoading } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
    isLoading: state.isLoading,
  }));

  const [customDomain, setCustomDomain] = useState("");

  const { data: project } = useProjectQuery(projectId);

  const handleDeploy = async (forceProduction: boolean) => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Deploying your app...",
      });
      await createDeployment(projectId, { forceProduction: forceProduction });
      stopLoading({
        id: "deploy",
        title: "Deployed",
        message: "You app was successfully deployed!",
      });
    } catch (error: any) {
      stopLoading({
        id: "deploy",
        title: "Oops",
        message: error,
        isError: true,
      });
    }
  };

  const openDeployLink = () => {
    const hostName = window?.location?.hostname ?? "";

    const domain = hostName ?? "";

    const isLocalhost = domain.startsWith("localhost");

    const baseDomain = isLocalhost
      ? `${domain}:3000`
      : customDomain
      ? customDomain
      : process.env.NEXT_PUBLIC_DEPLOYED_DOMAIN;

    const prefix = isLocalhost || !customDomain ? `${projectId}.` : "";

    const slug = pageListQuery?.results.find((p) => p.id === page)?.slug;

    const deployLink = new URL(
      `${isLocalhost ? "http" : "https"}://${prefix}${baseDomain}/${
        slug === "/" ? "" : slug
      }`,
    );

    // Validity check
    if (
      deployLink.href.startsWith("http") ||
      deployLink.href.startsWith("https")
    ) {
      window?.open(deployLink.href, "_blank");
    } else {
      console.error(`Invalid URL: ${deployLink.href}`);
    }
  };

  useEffect(() => {
    if (project) {
      const fullDomain = project.subDomain
        ? `${project.subDomain}.${project.domain}`
        : project.domain;

      if (fullDomain) {
        setCustomDomain(fullDomain);
      }
    }
  }, [project]);

  // Don't think we need this. We should just fetch the pages on server side and pass down
  useEffect(() => {
    if (isFetched) {
      setPages(pageListQuery?.results!);
    }
  }, [pageListQuery, isFetched, setPages]);

  return (
    <Button.Group>
      <Tooltip label="Deploy">
        <Button
          loading={isLoading}
          loaderPosition="center"
          disabled={isLoading}
          onClick={() => handleDeploy(true)}
          leftIcon={<Icon name="IconRocket" />}
        >
          Deploy
        </Button>
      </Tooltip>
      <Tooltip label="Preview">
        <ActionIconDefault
          iconName="IconLink"
          onClick={openDeployLink}
          tooltip="Preview your app"
          loading={isLoading}
          sx={{ borderRadius: "0px 4px 4px 0px" }}
        />
      </Tooltip>
    </Button.Group>
  );
};
