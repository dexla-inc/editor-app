import { DashboardShell } from "@/components/DashboardShell";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { ProjectItem } from "@/components/projects/ProjectItem";
import TeamInvitations from "@/components/settings/TeamInvitations";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { ProjectResponse, getProjects } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Container,
  Flex,
  Grid,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { IconSearch, IconSparkles } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const theme = useMantineTheme();
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const { startLoading } = useAppStore();
  const router = useRouter();

  const goToEditor = async (projectId: string, pageId: string) => {
    startLoading({
      id: "go-to-editor",
      title: "Loading Editor",
      message: "Wait while we load the editor for your project",
    });

    router.push(`/projects/${projectId}/editor/${pageId}`);
  };

  const fetchProjects = useCallback(async () => {
    const result = await getProjects(search);
    setProjects(result.results);
  }, [search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = (id: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id),
    );
  };

  const ownedProjects = projects.filter((project) => project.isOwner);
  const sharedProjects = projects.filter((project) => !project.isOwner);

  return (
    <DashboardShell user={user}>
      <Container py="xl" size="lg">
        <Stack spacing="xl">
          <Title>Welcome back, {user?.firstName}</Title>

          <Flex>
            <Link href="/projects/new">
              <IconTitleDescriptionButton
                icon={
                  <IconSparkles
                    size={LARGE_ICON_SIZE}
                    color={theme.colors.teal[5]}
                  />
                }
                title="Create new project"
                description="Type what you want to build and customise"
              ></IconTitleDescriptionButton>
            </Link>
          </Flex>
          {projects && (
            <TextInput
              placeholder="Search a project"
              icon={<IconSearch size={ICON_SIZE} />}
              onChange={(event) => {
                debouncedSearch(event.currentTarget.value);
              }}
            />
          )}
          <TeamInvitations />
          {ownedProjects.length > 0 && (
            <>
              {ownedProjects.length > 0 && sharedProjects.length > 0 && (
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
                    onDeleteProject={handleDeleteProject}
                  />
                ))}
              </Grid>
            </>
          )}
          {sharedProjects.length > 0 && (
            <>
              <Title order={4}>Shared With Me</Title>
              <Grid>
                {sharedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    theme={theme}
                    buttonHoverStyles={buttonHoverStyles}
                    goToEditor={goToEditor}
                    onDeleteProject={handleDeleteProject}
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
