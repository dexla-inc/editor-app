import { DashboardShell } from "@/components/DashboardShell";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { createProject, deleteProject } from "@/requests/projects/mutations";
import { ProjectListResponse, getProjects } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { ICON_SIZE } from "@/utils/config";
import { generateId } from "@/utils/dashboardTypes";
import {
  Container,
  Flex,
  Grid,
  Stack,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Projects() {
  //const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const theme = useMantineTheme();
  const { user, company } = usePropelAuthStore((state) => ({
    user: state.user,
    company: state.activeCompany,
  }));
  const manuallyCreatedProjectId = generateId();

  const startLoading = useAppStore((state) => state.startLoading);
  const router = useRouter();

  const goToEditor = async (projectId: string, pageId: string) => {
    startLoading({
      id: "go-to-editor",
      title: "Loading Editor",
      message: "Wait while we load the editor for your project",
    });

    router.push(`/projects/${projectId}/editor/${pageId}`);
  };

  const projectsQuery = useQuery<ProjectListResponse, Error>({
    queryKey: ["projects", company.orgId, search],
    queryFn: () => getProjects(company.orgId, search),
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation(deleteProject, {
    onSettled(_, err) {
      if (err) {
        console.error(err);
      }

      queryClient.invalidateQueries(["projects"]);
    },
  });

  const ownedProjects = projectsQuery.data?.results.filter(
    (project) => project.isOwner,
  );
  const sharedProjects = projectsQuery.data?.results.filter(
    (project) => !project.isOwner,
  );

  const createEmptyProject = async () => {
    // This is temporary until we create a right click context menu to create empty project
    const project = await createProject({}, true);
    const url = `/projects/${project.id}/editor/${project.homePageId}}`;

    router.push(url);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const intercomSettings = {
      app_id: "co2c3gri",
      email: user.email,
      user_id: user.userId,
      name: user.firstName + " " + user.lastName,
      created_at: user.createdAt,
      avatar: {
        type: "avatar",
        image_url: user.pictureUrl,
      },
      company: {
        id: company.orgId,
        name: company.orgName,
        plan: "free",
        monthly_spend: 0,
      },
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(intercomSettings);
  }, [user, company]);

  return (
    <DashboardShell>
      <Container py="xl" size="lg">
        <Stack spacing="xl">
          <Title>Welcome back, {user?.firstName}</Title>
          <Flex>
            {company.orgName !== "Dexla" ? (
              <Flex gap="sm">
                <Link
                  href={`/projects/new?company=${company.orgId}&id=${manuallyCreatedProjectId}`}
                >
                  <IconTitleDescriptionButton
                    icon="IconSparkles"
                    title="Create new project"
                    description="Type what you want to build and customise"
                    color="teal"
                  />
                </Link>
                <IconTitleDescriptionButton
                  icon="IconSparkles"
                  title="Create empty project"
                  description="Start from scratch"
                  onClick={createEmptyProject}
                />
              </Flex>
            ) : (
              <Tooltip label="You are unable to create new projects for Dexla">
                <IconTitleDescriptionButton
                  icon="IconSparkles"
                  tooltip="This company is used for the Templates project only"
                  title="Create new project"
                  description="Type what you want to build and customise"
                />
              </Tooltip>
            )}
          </Flex>

          {projectsQuery.data?.results && (
            <TextInput
              placeholder="Search a project"
              icon={<IconSearch size={ICON_SIZE} />}
              onChange={(event) => {
                debouncedSearch(event.currentTarget.value);
              }}
            />
          )}
          {/* <TeamInvitations /> */}
          {ownedProjects && ownedProjects.length > 0 && (
            <>
              {ownedProjects.length > 0 &&
                sharedProjects &&
                sharedProjects.length > 0 && (
                  <Title order={4}>My Projects</Title>
                )}
              <Grid>
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    theme={theme}
                    buttonHoverStyles={buttonHoverStyles}
                    goToEditor={goToEditor}
                    onDeleteProject={mutate}
                  />
                ))}
              </Grid>
            </>
          )}
          {sharedProjects && sharedProjects.length > 0 && (
            <>
              <Title order={4}>Shared With Me</Title>
              <Grid>
                {sharedProjects &&
                  sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      theme={theme}
                      buttonHoverStyles={buttonHoverStyles}
                      goToEditor={goToEditor}
                    />
                  ))}
              </Grid>
            </>
          )}
        </Stack>
      </Container>
    </DashboardShell>
  );
}
