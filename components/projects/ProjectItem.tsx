import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { getPageList } from "@/requests/pages/queries-noauth";
import { ProjectResponse } from "@/requests/projects/types";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { THIN_DARK_OUTLINE, THIN_GRAY_OUTLINE } from "@/utils/branding";
import { regionTypeFlags } from "@/utils/dashboardTypes";
import {
  Avatar,
  Box,
  Col,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { ProjectItemMenu } from "./ProjectItemMenu";

type ProjectItemProps = {
  project: ProjectResponse;
  goToEditor: (projectId: string, pageId: string) => Promise<void>;
  onDeleteProject?: (id: string) => void;
};

export function ProjectItem({
  project,
  goToEditor,
  onDeleteProject,
}: ProjectItemProps) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [isHovered, setIsHovered] = useState(false);
  const company = usePropelAuthStore((state) => state.activeCompany);
  const queryClient = useQueryClient();

  const goToEditorHomePage = async () => {
    const data = await queryClient.fetchQuery(["pages", project.id], () =>
      getPageList(project.id),
    );

    const homePage = data.results.find((page) => page.isHome);
    let pageId: string | undefined = homePage?.id;

    if (!pageId && data.results.length > 0) {
      pageId = data.results[0].id;
    }

    if (pageId !== undefined) {
      goToEditor(project.id, pageId);
    } else {
      const newProjectUrl = `/projects/new?company=${company.orgId}&projectId=${project.id}&step=2`;
      router.push(newProjectUrl);
    }
  };

  const isDarkTheme = theme.colorScheme === "dark";
  const borderStyle = isDarkTheme ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE;

  return (
    <Col lg={4} md={6} xs={12}>
      <Box
        sx={{
          borderRadius: theme.radius.sm,
          border: borderStyle,
        }}
      >
        <UnstyledButton
          p="md"
          sx={{
            borderTopRightRadius: theme.radius.sm,
            borderTopLeftRadius: theme.radius.sm,
            width: "100%",
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
            ...buttonHoverStyles(theme),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={goToEditorHomePage}
        >
          {!isHovered && <Text truncate="end">{project.friendlyName}</Text>}
          {isHovered && <Text>Go to editor</Text>}
        </UnstyledButton>
        <Flex
          align="center"
          justify="space-between"
          py="xs"
          px="md"
          sx={{
            borderTop: borderStyle,
            width: "100%",
          }}
        >
          <Flex direction="column">
            <Text size="xs" color="dimmed">
              Hosted In
            </Text>
            <Avatar src={regionTypeFlags[project.region.type]} size="sm" />
          </Flex>
          <ProjectItemMenu
            projectId={project.id}
            projectFriendlyName={project.friendlyName}
            goToEditor={goToEditor}
            onDeleteProject={onDeleteProject}
          />
        </Flex>
      </Box>
    </Col>
  );
}
