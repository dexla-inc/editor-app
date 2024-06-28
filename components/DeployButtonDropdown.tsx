import { useDeploymentRecent } from "@/hooks/editor/reactQuery/useDeploymentRecent";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { EnvironmentTypes } from "@/requests/datasources/types";
import {
  createDeployment,
  promoteDeployment,
} from "@/requests/deployments/mutations";
import { ProjectResponse } from "@/requests/projects/types";
import { useAppStore } from "@/stores/app";
import { generateProjectSlugLink } from "@/utils/common";
import {
  Box,
  useMantineTheme,
  Stack,
  Text,
  Divider,
  Title,
  Anchor,
  Flex,
  Tooltip,
  ActionIcon,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export const DeployButtonDropdown = () => {
  const { id: projectId, page } = useEditorParams();
  const { data: deployments, invalidate } = useDeploymentRecent(projectId);
  // TODO: Backend add pages to deployments without state
  const { data: pageListQuery, isFetched } = usePageListQuery(projectId, null);
  const theme = useMantineTheme();

  const { startLoading, stopLoading } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
  }));

  const [slug, setSlug] = useState<string>("");

  const sortedDeployments = deployments?.results.slice().sort((a, b) => {
    if (a.environment > b.environment) return -1;
    if (a.environment < b.environment) return 1;
    return 0;
  });

  const handleDeploy = async (
    project: ProjectResponse,
    environment: EnvironmentTypes,
  ) => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Deploying your app to " + environment + "...",
      });

      const deployUrl = getDeployUrl(project, environment, slug);

      await createDeployment(projectId, deployUrl?.host ?? "", {
        forceProduction: environment === "Production",
      });

      invalidate();

      stopLoading({
        id: "deploy",
        title: "Deployed",
        message: "You app was successfully deployed to " + environment + "!",
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

  const promote = async () => {
    try {
      startLoading({
        id: "deploy",
        title: "Deploying",
        message: "Promoting your app to Production...",
      });

      await promoteDeployment(projectId);
      invalidate();

      stopLoading({
        id: "deploy",
        title: "Deployed",
        message: "You app was successfully promoted to Production!",
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

  const openDeployHref = (href: string) => {
    if (href.startsWith("http") || href.startsWith("https")) {
      window?.open(href, "_blank");
    } else {
      console.error(`Invalid URL: ${href}`);
    }
  };

  useEffect(() => {
    if (isFetched && page) {
      setSlug(pageListQuery?.results.find((p) => p.id === page)?.slug ?? "");
    }
  }, [pageListQuery, isFetched, page]);

  return (
    <Box>
      {sortedDeployments?.map((deployment, index) => {
        const deployUrl = getDeployUrl(
          deployment.project,
          deployment.environment,
          slug,
        );
        const primaryColor = theme.colors.teal[6];
        return (
          <Stack key={deployment.environment} spacing="xs">
            <Title order={5}>{deployment.environment}</Title>
            <Box>
              <Tooltip label={deployUrl?.href}>
                <Flex align="center" gap={2}>
                  <Anchor
                    size="xs"
                    lineClamp={1}
                    href={deployUrl?.href}
                    target="_blank"
                  >
                    {deployUrl?.href}
                  </Anchor>
                  <ActionIcon
                    size="xs"
                    onClick={() => openDeployHref(deployUrl?.href!)}
                  >
                    <Icon name="IconExternalLink" color={primaryColor} />
                  </ActionIcon>
                </Flex>
              </Tooltip>
            </Box>
            <Box>
              <Text size="xs">Last Deployed By</Text>
              <Text size="xs" color="dimmed">
                {deployment.updatedBy.name}
              </Text>
              <Text size="xs" color="dimmed">
                {" "}
                {new Date(deployment.updatedBy.date).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Box>
            <Flex gap="xs">
              <Button
                onClick={() =>
                  handleDeploy(deployment.project, deployment.environment)
                }
                leftIcon={<Icon name="IconRocket" />}
              >
                Deploy
              </Button>
              {deployment.environment === "Staging" && (
                <Button
                  onClick={promote}
                  leftIcon={<Icon name="IconRocket" />}
                  variant="outline"
                  disabled={!deployment.canPromote}
                >
                  Promote
                </Button>
              )}
            </Flex>
            {index < sortedDeployments.length - 1 && <Divider mb="xs" />}
          </Stack>
        );
      })}
    </Box>
  );
};

const getDeployUrl = (
  project: ProjectResponse,
  environment: EnvironmentTypes,
  slug: string,
) => {
  if (!project.liveUrls) return;

  const liveUrl = project.liveUrls[environment];

  const fullDomain = liveUrl.subDomain
    ? `${liveUrl.subDomain}.${liveUrl.domain}`
    : liveUrl.domain;

  return generateProjectSlugLink(project.id, fullDomain, slug);
};
