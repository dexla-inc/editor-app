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
  Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";

export const DeployButtonDropdown = () => {
  const { id: projectId, page } = useEditorParams();
  const {
    data: deployments,
    isLoading,
    invalidate,
  } = useDeploymentRecent(projectId);
  // TODO: Backend add pages to deployments without state
  const { data: pageListQuery, isFetched } = usePageListQuery(projectId, null);
  const theme = useMantineTheme();

  const {
    startLoading,
    stopLoading,
    isLoading: globalLoading,
  } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
    isLoading: state.isLoading,
  }));

  const [shouldFetchProject, setShouldFetchProject] = useState<boolean>(false);
  const { data: project } = useProjectQuery(projectId, shouldFetchProject);
  const [slug, setSlug] = useState<string>("");
  useEffect(() => {
    if (deployments?.results.length === 0) {
      setShouldFetchProject(true);
    }
  }, [deployments]);

  const defaultEnvironments = ["Staging", "Production"] as EnvironmentTypes[];
  const sortedDeployments = deployments?.results.slice().sort((a, b) => {
    if (a.environment > b.environment) return -1;
    if (a.environment < b.environment) return 1;
    return 0;
  });

  const deploymentsByEnvironment = defaultEnvironments.map((env) => {
    return (
      sortedDeployments?.find(
        (deployment) => deployment.environment === env,
      ) || {
        environment: env,
        updatedBy: undefined,
        project: project,
        canPromote: false,
      }
    );
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

      const deployHost = getDeployHost(project, environment, slug);

      await createDeployment(projectId, deployHost ?? "", {
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

  return isLoading ? (
    <Loader />
  ) : (
    <Box>
      {deploymentsByEnvironment?.map((deployment, index) => {
        const deployUrl = getDeployHref(
          deployment.project!,
          deployment.environment,
          slug,
        );
        const primaryColor = theme.colors.teal[6];
        return (
          <Stack key={deployment.environment} spacing="xs">
            <Title order={5}>{deployment.environment}</Title>
            <Box>
              <Tooltip label={deployUrl}>
                <Flex align="center" gap={2}>
                  <Anchor
                    size="xs"
                    lineClamp={1}
                    href={deployUrl}
                    target="_blank"
                  >
                    {deployUrl}
                  </Anchor>
                  <ActionIcon
                    size="xs"
                    onClick={() => openDeployHref(deployUrl!)}
                  >
                    <Icon name="IconExternalLink" color={primaryColor} />
                  </ActionIcon>
                </Flex>
              </Tooltip>
            </Box>
            {deployment.updatedBy?.name && (
              <Box>
                <Text size="xs">Last Deployed By</Text>
                <Text size="xs" color="dimmed">
                  {deployment.updatedBy.name}
                </Text>
                <Text size="xs" color="dimmed">
                  {" "}
                  {new Date(deployment.updatedBy.date).toLocaleString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </Text>
              </Box>
            )}
            <Flex gap="xs">
              <Button
                onClick={() =>
                  handleDeploy(deployment.project!, deployment.environment)
                }
                leftIcon={<Icon name="IconRocket" />}
                loading={globalLoading}
              >
                Deploy
              </Button>
              {deployment.environment === "Staging" && (
                <Button
                  onClick={promote}
                  leftIcon={<Icon name="IconRocket" />}
                  variant="outline"
                  disabled={!deployment.canPromote}
                  loading={globalLoading}
                >
                  Promote
                </Button>
              )}
            </Flex>
            {index < deploymentsByEnvironment.length - 1 && <Divider mb="xs" />}
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
  if (!project.liveUrls) return undefined;

  const liveUrl = project.liveUrls[environment];

  //if(!liveUrl.subDomain && !liveUrl.domain) return;

  const fullDomain = liveUrl?.subDomain
    ? `${liveUrl?.subDomain}.${liveUrl?.domain}`
    : liveUrl?.domain;

  return generateProjectSlugLink(project.id, fullDomain, slug);
};

const getDeployHref = (
  project: ProjectResponse,
  environment: EnvironmentTypes,
  slug: string,
) => {
  const url = getDeployUrl(project, environment, slug);
  return url?.href;
};

const getDeployHost = (
  project: ProjectResponse,
  environment: EnvironmentTypes,
  slug: string,
) => {
  const url = getDeployUrl(project, environment, slug);
  return url?.host;
};
