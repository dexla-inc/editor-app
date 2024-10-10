"use client";

import { DashboardShell } from "@/components/DashboardShell";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { useProjectListQuery } from "@/hooks/editor/reactQuery/useProjectListQuery";
import { useProjectMutatation } from "@/hooks/editor/reactQuery/useProjectMutation";
import { createProject } from "@/requests/projects/mutations";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useUserConfigStore } from "@/stores/userConfig";
import { ICON_SIZE } from "@/utils/config";
import {
  Container,
  Flex,
  Grid,
  Stack,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateTemplateProject } from "@/hooks/editor/useCreateTemplateProject";
import { usePropelAuth } from "@/hooks/editor/usePropelAuth";
import { invalidateQueries } from "@/hooks/editor/reactQuery/useProjectQuery";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 100);
  const user = usePropelAuthStore((state) => state.user);
  const company = usePropelAuthStore((state) => state.activeCompany);

  const startLoading = useAppStore((state) => state.startLoading);

  const { setPageCancelled } = useUserConfigStore((state) => ({
    setPageCancelled: state.setPageCancelled,
  }));

  const resetTree = useEditorTreeStore((state) => state.resetTree);

  const goToEditor = async (projectId: string, pageId: string) => {
    router.push(`/projects/${projectId}/editor/${pageId}`);
  };

  const { data: projectsQuery, invalidate } = useProjectListQuery(
    company.orgId,
  );

  useCreateTemplateProject(company.orgId);

  const { mutate } = useProjectMutatation();

  const ownedProjects = projectsQuery?.results.filter(
    (project) => project.isOwner,
  );
  const sharedProjects = projectsQuery?.results.filter(
    (project) => !project.isOwner,
  );
  const [filteredOwnedProjects, setFilteredOwnedProjects] =
    useState(ownedProjects);
  const [filteredSharedProjects, setFilteredSharedProjects] =
    useState(sharedProjects);

  const { refreshAuth } = usePropelAuth();

  const createEmptyProject = async () => {
    startLoading({
      id: "go-to-editor",
      title: "Loading App",
      message: "Wait while we load the editor for your project",
    });

    setPageCancelled(true);
    const project = await createProject(
      { companyId: company.orgId, cssType: "GRID" },
      true,
    );
    invalidateQueries(["project"]);
    invalidate();

    const url = `/projects/${project.id}/editor/${project.homePageId}`;

    router.push(url);
    refreshAuth();
  };

  useEffect(() => {
    resetTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (projectsQuery?.results) {
      setFilteredOwnedProjects(
        ownedProjects?.filter((project) =>
          project.friendlyName.toLowerCase().includes(search.toLowerCase()),
        ),
      );
      setFilteredSharedProjects(
        sharedProjects?.filter((project) =>
          project.friendlyName.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, projectsQuery]);

  return (
    <DashboardShell>
      <Container
        py="xl"
        size="lg"
        sx={{ minHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <Stack spacing="xl">
          <Title>Welcome back, {user?.firstName}</Title>
          <Flex>
            {company.orgName !== "Dexla" ? (
              <Flex gap="sm">
                {/* <Tooltip label="Coming soon">
                  <Link
                    href={`/projects/new?company=${company.orgId}&id=${manuallyCreatedProjectId}`}
                  >
                    <IconTitleDescriptionButton
                      icon="IconSparkles"
                      title="Create new project"
                      description="Type what you want to build and customise. (Coming soon)"
                      disabled
                    />
                  </Link>
                </Tooltip> */}
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

          {projectsQuery?.results && (
            <TextInput
              placeholder="Search a project"
              icon={<IconSearch size={ICON_SIZE} />}
              onChange={(event) => {
                debouncedSearch(event.currentTarget.value);
              }}
            />
          )}
          {filteredOwnedProjects && filteredOwnedProjects.length > 0 && (
            <>
              {filteredOwnedProjects.length > 0 &&
                filteredSharedProjects &&
                filteredSharedProjects.length > 0 && (
                  <Title order={4}>My Projects</Title>
                )}
              <Grid>
                {filteredOwnedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    goToEditor={goToEditor}
                    onDeleteProject={mutate}
                  />
                ))}
              </Grid>
            </>
          )}
          {filteredSharedProjects && filteredSharedProjects.length > 0 && (
            <>
              <Title order={4}>Shared With Me</Title>
              <Grid>
                {filteredSharedProjects &&
                  filteredSharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      goToEditor={goToEditor}
                    />
                  ))}
              </Grid>
            </>
          )}
        </Stack>

        <Flex justify="flex-end" style={{ marginTop: "auto" }}>
          <Link href="https://discord.gg/CPEy8ePKj4" target="_blank">
            <Image
              src="/join-us-on-discord.jpg"
              alt="Join Dexla on Discord"
              width={200}
              height={100}
              style={{ borderRadius: 4 }}
            />
          </Link>
        </Flex>
      </Container>
    </DashboardShell>
  );
}
