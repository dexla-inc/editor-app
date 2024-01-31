import { ActionIconDefault } from "@/components/ActionIconDefault";
import { Icon } from "@/components/Icon";
import { useDeploymentsPageQuery } from "@/hooks/reactQuery/useDeploymentsPageQuery";
import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { createDeployment } from "@/requests/deployments/mutations";
import { useAppStore } from "@/stores/app";
import { Button, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  page?: any;
};

export const DeployButton = ({ projectId, page }: Props) => {
  const { startLoading, stopLoading, isLoading } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
    isLoading: state.isLoading,
  }));

  const [customDomain, setCustomDomain] = useState("");
  const [hasDeployed, setHasDeployed] = useState(false);

  const homePageSlug = "/";
  const { data: recentDeployment, invalidate: invalidatePage } =
    useDeploymentsPageQuery(projectId, homePageSlug);

  const { data: project } = useProjectQuery(projectId);

  const handleDeploy = async (forceProduction: boolean) => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Deploying your app...",
      });
      await createDeployment(projectId, { forceProduction: forceProduction });
      invalidatePage();
      setHasDeployed(true);
      stopLoading({
        id: "deploy",
        title: "Deployed",
        message: "You app was successfully deployed!",
      });
    } catch (error) {
      stopLoading({
        id: "deploy",
        title: "Oops",
        message: "Something went wrong",
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
      : "dexla.io";

    const prefix = isLocalhost || !customDomain ? `${projectId}.` : "";

    const deployLink = new URL(
      `${isLocalhost ? "http" : "https"}://${prefix}${baseDomain}/${
        page?.slug === "/" ? "" : page?.slug
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

  useEffect(() => {
    if (recentDeployment?.id) {
      setHasDeployed(true);
    }
  }, [recentDeployment]);

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
          disabled={!hasDeployed || isLoading}
          sx={{ borderRadius: "0px 4px 4px 0px" }}
        />
      </Tooltip>
    </Button.Group>
  );
};
