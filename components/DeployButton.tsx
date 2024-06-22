import { ActionIconDefault } from "@/components/ActionIconDefault";
import { Icon } from "@/components/Icon";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { createDeployment } from "@/requests/deployments/mutations";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { generateProjectSlugLink } from "@/utils/common";
import { Button, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";

export const DeployButton = () => {
  const { id: projectId, page } = useEditorParams();
  const [customDomain, setCustomDomain] = useState("");
  const [deployUrl, setDeployUrl] = useState<URL>();
  const [slug, setSlug] = useState<string>("");

  const { data: pageListQuery, isFetched } = usePageListQuery(projectId, null);
  const setPages = useEditorStore((state) => state.setPages);
  const canDeploy = usePropelAuthStore(
    (state) => !!state.userPermissions.find((p) => p === "can_deploy"),
  );

  const { startLoading, stopLoading, isLoading } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
    isLoading: state.isLoading,
  }));

  const { data: project } = useProjectQuery(projectId);

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
    if (isFetched && page) {
      setPages(pageListQuery?.results!);
      setSlug(pageListQuery?.results.find((p) => p.id === page)?.slug ?? "");
    }
  }, [pageListQuery, isFetched, setPages, page]);

  useEffect(() => {
    if (projectId && page && slug) {
      const deployUrl = generateProjectSlugLink(projectId, customDomain, slug);
      setDeployUrl(deployUrl);
    }
  }, [projectId, customDomain, page, slug]);

  const handleDeploy = async (forceProduction: boolean) => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Deploying your app...",
      });

      await createDeployment(projectId, deployUrl?.host ?? "", {
        forceProduction: forceProduction,
      });
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
    if (
      deployUrl?.href.startsWith("http") ||
      deployUrl?.href.startsWith("https")
    ) {
      window?.open(deployUrl?.href, "_blank");
    } else {
      console.error(`Invalid URL: ${deployUrl?.href}`);
    }
  };

  const deployIsDisabled = !canDeploy || (canDeploy && isLoading);

  return (
    <Button.Group>
      <Tooltip label="Deploy">
        <Button
          loading={isLoading}
          loaderPosition="center"
          disabled={deployIsDisabled}
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
