import { createDeployment } from "@/requests/deployments/mutations";
import { getMostRecentDeployment } from "@/requests/deployments/queries";
import { getProject } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import { Button } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  page?: any;
};

export const DeployButton = ({ projectId, page }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const isLoading = useAppStore((state) => state.isLoading);
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
      deployLink.origin.startsWith("http") ||
      deployLink.origin.startsWith("https")
    ) {
      window?.open(deployLink.origin, "_blank");
    } else {
      console.error(`Invalid URL: ${deployLink.origin}`);
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
      <Button
        loading={isLoading}
        loaderPosition="center"
        disabled={isLoading}
        onClick={() => handleDeploy(true)}
        compact
      >
        Deploy
      </Button>
      <Button
        color="indigo"
        compact
        loading={isLoading}
        loaderPosition="center"
        disabled={!hasDeployed || isLoading}
        onClick={openDeployLink}
      >
        <IconLink size={ICON_SIZE} />
      </Button>
    </Button.Group>
  );
};
