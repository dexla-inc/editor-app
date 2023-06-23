import { Shell } from "@/components/AppShell";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { ProjectResponse, getProjects } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Anchor,
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
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const theme = useMantineTheme();
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const { isLoading, setIsLoading, startLoading, stopLoading } = useAppStore();
  const router = useRouter();

  const goToEditor = async (projectId: string, pageId: string) => {
    startLoading({
      id: "go-to-editor",
      title: "Loading Editor",
      message: "Wait while we load the editor for your project",
    });

    router.push(`/projects/${projectId}/editor/${pageId}`);
  };

  const listProjects = useCallback(async () => {
    setIsLoading(true);
    const pageList = await getProjects(search);
    setProjects(pageList.results);
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    listProjects();
  }, [listProjects]);

  const handleDeleteProject = (id: string) => {
    // Remove the deleted project from the projects array
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id)
    );
  };

  return (
    <Shell navbarType="dashboard" user={user}>
      <Container py="xl" size="lg">
        <Stack spacing="xl">
          <Title>Welcome back, {user?.firstName}</Title>

          <Flex>
            <Anchor href="/projects/new">
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
            </Anchor>
          </Flex>
          {projects && projects.length > 0 && (
            <TextInput
              placeholder="Search a project"
              icon={<IconSearch size={ICON_SIZE} />}
              onChange={(event) => {
                debouncedSearch(event.currentTarget.value);
              }}
            />
          )}
          <Grid>
            {projects.map((project) => {
              return (
                <ProjectItem
                  key={project.id}
                  project={project}
                  theme={theme}
                  buttonHoverStyles={buttonHoverStyles}
                  isLoading={isLoading}
                  goToEditor={goToEditor}
                  onDeleteProject={handleDeleteProject}
                />
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Shell>
  );
}
