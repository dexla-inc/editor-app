import { getPageList } from "@/requests/pages/queries";
import { PageResponse } from "@/requests/pages/types";
import { deleteProject } from "@/requests/projects/mutations";
import { ProjectResponse } from "@/requests/projects/queries";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { regionTypeFlags } from "@/utils/dashboardTypes";
import {
  Avatar,
  Box,
  Col,
  Collapse,
  Flex,
  MantineTheme,
  Menu,
  NavLink,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconDatabase,
  IconDots,
  IconFileAnalytics,
  IconHome,
  IconSettings,
  IconSettings2,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type ProjectItemProps = {
  project: ProjectResponse;
  theme: MantineTheme;
  buttonHoverStyles: any;
  goToEditor: (projectId: string, pageId: string) => Promise<void>;
  onDeleteProject: (id: string) => void;
};

export function ProjectItem({
  project,
  theme,
  buttonHoverStyles,
  goToEditor,
  onDeleteProject,
}: ProjectItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [pagesLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);

  const goToEditorHomePage = async () => {
    const pages = await getPageList(project.id);
    setPages(pages.results);

    const homePage = pages.results.find((page) => page.isHome);
    const pageId = homePage?.id || pages.results[0].id;
    goToEditor(project.id, pageId);
  };

  const getPages = async () => {
    const pages = await getPageList(project.id);
    setPages(pages.results);
  };

  const deleteProjectFn = async () => {
    await deleteProject(project.id);
    onDeleteProject(project.id);
    setPages([]);
  };

  return (
    <Col lg={4} md={6} xs={12}>
      <Box
        sx={{
          borderRadius: theme.radius.sm,
          border: "1px solid " + theme.colors.gray[2],
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
          {isHovered && <Text align="center">Go to editor</Text>}
        </UnstyledButton>
        <Flex
          align="center"
          justify="space-between"
          py="xs"
          px="md"
          sx={{
            borderTop: "1px solid " + theme.colors.gray[2],
            width: "100%",
          }}
        >
          <Flex direction="column">
            <Text size="xs" color="dimmed">
              Hosted In
            </Text>
            <Avatar src={regionTypeFlags[project.region.type]} size="sm" />
          </Flex>
          <Menu width={250} withArrow offset={20} onOpen={getPages}>
            <Menu.Target>
              <UnstyledButton
                sx={{
                  borderRadius: theme.radius.sm,
                  ...buttonHoverStyles(theme),
                }}
              >
                <IconDots size={LARGE_ICON_SIZE} color={theme.colors.teal[5]} />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Project</Menu.Label>
              <NavLink
                label="Pages"
                icon={<IconFileAnalytics size={ICON_SIZE} />}
                rightSection={
                  opened ? (
                    <IconChevronDown size={ICON_SIZE} />
                  ) : (
                    <IconChevronRight size={ICON_SIZE} />
                  )
                }
                onClick={() => setOpened((isOpen) => !isOpen)}
              />
              <Collapse in={opened}>
                {pages.map((page) => {
                  return (
                    <Skeleton key={page.id} visible={pagesLoading}>
                      <Box ml={10}>
                        <Menu.Item
                          icon={
                            page.isHome ? (
                              <IconHome size={ICON_SIZE} />
                            ) : (
                              <IconFileAnalytics size={ICON_SIZE} />
                            )
                          }
                          onClick={() => goToEditor(project.id, page.id)}
                        >
                          {page.title}
                        </Menu.Item>
                      </Box>
                    </Skeleton>
                  );
                })}
              </Collapse>
              <NavLink
                label="Settings"
                icon={<IconSettings size={ICON_SIZE} />}
                rightSection={
                  settingsOpened ? (
                    <IconChevronDown size={ICON_SIZE} />
                  ) : (
                    <IconChevronRight size={ICON_SIZE} />
                  )
                }
                onClick={() => setSettingsOpened((isOpen) => !isOpen)}
              />
              <Collapse in={settingsOpened}>
                <Box ml={10}>
                  <Menu.Item
                    icon={<IconSettings2 size={ICON_SIZE} />}
                    component={Link}
                    href={`/projects/${project.id}/settings`}
                  >
                    General
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconDatabase size={ICON_SIZE} />}
                    component={Link}
                    href={`/projects/${project.id}/settings/datasources`}
                  >
                    Datasource
                  </Menu.Item>
                </Box>
              </Collapse>
              <Menu.Item
                icon={<IconTrash size={ICON_SIZE} />}
                color="red"
                onClick={deleteProjectFn}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Box>
    </Col>
  );
}
