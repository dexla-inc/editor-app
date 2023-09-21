import { createDeployment } from "@/requests/deployments/mutations";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import { Button } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";

type Props = {
  projectId: string;
  page?: any;
};

export const DeployButton = ({ projectId, page }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  const handleDeploy = async () => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Deploying your app...",
      });
      await createDeployment(projectId, { forceProduction: false });
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

  return (
    <Button.Group>
      <Button loading={isLoading} disabled={isLoading} onClick={handleDeploy}>
        Deploy
      </Button>
      <Button
        onClick={() => {
          const domain = window?.location?.hostname ?? "";
          const isLocalhost = domain.startsWith("localhost");
          const deployLink = `${
            isLocalhost ? "http" : "https"
          }://${projectId}.${
            isLocalhost ? `${domain}:3000` : domain
          }/${page?.slug}`;
          window?.open(deployLink, "_blank");
        }}
      >
        <IconLink size={ICON_SIZE} />
      </Button>
    </Button.Group>
  );
};
