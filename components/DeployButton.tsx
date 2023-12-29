import { Icon } from "@/components/Icon";
import { createDeployment } from "@/requests/deployments/mutations";
import { getMostRecentDeployment } from "@/requests/deployments/queries-noauth";
import { getProject } from "@/requests/projects/queries-noauth";
import { useAppStore } from "@/stores/app";
import { Button, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { ActionIconDefault } from "./ActionIconDefault";

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

  const handleDeploy = async (forceProduction: boolean) => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Deploying your app...",
      });
      await createDeployment(projectId, { forceProduction: forceProduction });
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

    const deployLink = new URL(
      `${isLocalhost ? "http" : "https"}://${projectId}.${baseDomain}/${
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
    const fetchProject = async () => {
      const project = await getProject(projectId);
      const deployments = await getMostRecentDeployment(projectId);

      const fullDomain = project.subDomain
        ? `${project.subDomain}.${project.domain}`
        : project.domain;

      if (fullDomain) {
        setCustomDomain(fullDomain);
      }

      if (deployments.id) {
        setHasDeployed(true);
      }
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <Button.Group>
      <Tooltip label="Deploy" fz="xs">
        <Button
          loading={isLoading}
          loaderPosition="center"
          disabled={isLoading}
          onClick={() => handleDeploy(true)}
          compact
          leftIcon={<Icon name="IconRocket" />}
        >
          Deploy
        </Button>
      </Tooltip>
      <Tooltip label="Preview" fz="xs">
        {/* <ActionIcon
            variant="default"
            onClick={() => handlePageStateChange(redo)}
            disabled={futureStates.length === 0}
            radius={"0px 4px 4px 0px"}
            size="sm"
          >
            <Icon name="IconArrowForwardUp" />
          </ActionIcon> */}
        <ActionIconDefault
          iconName="IconLink"
          onClick={openDeployLink}
          tooltip="Preview your app"
          loading={isLoading}
          disabled={!hasDeployed || isLoading}
        />
      </Tooltip>
    </Button.Group>
  );
};
