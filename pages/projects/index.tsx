import { Shell } from "@/components/AppShell";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { ProjectResponse, getProjects } from "@/requests/projects/queries";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Container,
  Flex,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { IconSearch, IconSparkles } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const theme = useMantineTheme();
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};

  const listProjects = useCallback(async () => {
    const pageList = await getProjects(search);
    setProjects(pageList.results);
  }, [search]);

  useEffect(() => {
    listProjects();
  }, [listProjects]);

  return (
    <Shell navbarType="dashboard" user={user}>
      <Container py="xl" size="lg">
        <Stack spacing="xl">
          <Title>Welcome back, {user?.firstName}</Title>
          <TextInput
            placeholder="Search a project"
            icon={<IconSearch size={ICON_SIZE} />}
            onChange={(event) => {
              debouncedSearch(event.currentTarget.value);
            }}
          />
          <Flex>
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
          </Flex>
          <Flex gap="md">
            {projects.map((project, index) => {
              return (
                <Stack key={index}>
                  <Text>{project.friendlyName}</Text>
                  <Text>{project.region.name}</Text>
                </Stack>
              );
            })}
          </Flex>
        </Stack>
      </Container>
    </Shell>
  );
}
