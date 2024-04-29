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
import { generateId } from "@/utils/dashboardTypes";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Projects() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const user = usePropelAuthStore((state) => state.user);
  const company = usePropelAuthStore((state) => state.activeCompany);

  const manuallyCreatedProjectId = generateId();

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
    search,
  );

  const { mutate } = useProjectMutatation();

  const ownedProjects = projectsQuery?.results.filter(
    (project) => project.isOwner,
  );
  const sharedProjects = projectsQuery?.results.filter(
    (project) => !project.isOwner,
  );

  const createEmptyProject = async () => {
    startLoading({
      id: "go-to-editor",
      title: "Loading App",
      message: "Wait while we load the editor for your project",
    });

    setPageCancelled(true);
    const project = await createProject({ companyId: company.orgId }, true);
    invalidate();
    const url = `/projects/${project.id}/editor/${project.homePageId}`;

    router.push(url);
  };

  useEffect(() => {
    resetTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Add this back when so we get rid of InitializeVariables.ts
  // useVariableListQuery({ onSuccess: initializeVariableList });

  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }

  //   const intercomSettings = {
  //     app_id: "co2c3gri",
  //     email: user.email,
  //     user_id: user.userId,
  //     name: user.firstName + " " + user.lastName,
  //     created_at: user.createdAt,
  //     avatar: {
  //       type: "avatar",
  //       image_url: user.pictureUrl,
  //     },
  //     company: {
  //       id: company.orgId,
  //       name: company.orgName,
  //       plan: "free",
  //       monthly_spend: 0,
  //     },
  //   };

  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push(intercomSettings);
  // }, [user, company]);

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

          {projectsQuery?.results && (
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
