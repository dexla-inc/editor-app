import { Icon } from "@/components/Icon";
import { getPageList } from "@/requests/pages/queries";
import { PageResponse } from "@/requests/pages/types";
import { deleteProject } from "@/requests/projects/mutations";
import { ProjectResponse } from "@/requests/projects/queries";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { THIN_DARK_OUTLINE, THIN_GRAY_OUTLINE } from "@/utils/branding";
import { ICON_DELETE, ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { regionTypeFlags } from "@/utils/dashboardTypes";
import {
  Avatar,
  Box,
  Col,
  Collapse,
  Flex,
  Loader,
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
  IconDots,
  IconFileAnalytics,
  IconHome,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type ProjectItemProps = {
  project: ProjectResponse;
  theme: MantineTheme;
  buttonHoverStyles: any;
  goToEditor: (projectId: string, pageId: string) => Promise<void>;
  onDeleteProject?: (id: string) => void;
};

export function ProjectItem({
  project,
  theme,
  buttonHoverStyles,
  goToEditor,
  onDeleteProject,
}: ProjectItemProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [pagesLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDexlaAdmin, company } = usePropelAuthStore((state) => ({
    isDexlaAdmin: state.isDexlaAdmin,
    company: state.activeCompany,
  }));

  const goToEditorHomePage = async () => {
    const pages = await getPageList(project.id);
    setPages(pages.results);

    const homePage = pages.results.find((page) => page.isHome);
    let pageId: string | undefined = homePage?.id;

    if (!pageId && pages.results.length > 0) {
      pageId = pages.results[0].id;
    }

    if (pageId !== undefined) {
      goToEditor(project.id, pageId);
    } else {
      const newProjectUrl = `/projects/new?company=${company.orgId}&projectId=${project.id}&step=2`;
      router.push(newProjectUrl);
    }
  };

  const getPages = async () => {
    const pages = await getPageList(project.id);
    setPages(pages.results);
  };

  const deleteProjectFn = async () => {
    setIsLoading(true);
    await deleteProject(project.id);
    onDeleteProject && onDeleteProject(project.id);
    setPages([]);
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
          <Menu width={250} withArrow offset={20} onOpen={getPages}>
            <Menu.Target>
              <UnstyledButton
                sx={{
                  borderRadius: theme.radius.sm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...buttonHoverStyles(theme),
                }}
              >
                {isLoading ? (
                  <Loader size="sm" />
                ) : (
                  <IconDots
                    size={LARGE_ICON_SIZE}
                    color={theme.colors.teal[5]}
                  />
                )}
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
                    icon={<Icon name="IconSettings2" size={ICON_SIZE} />}
                    component={Link}
                    href={`/projects/${project.id}/settings?name=${project.friendlyName}`}
                  >
                    General
                  </Menu.Item>
                  <Menu.Item
                    icon={<Icon name="IconDatabase" size={ICON_SIZE} />}
                    component={Link}
                    href={`/projects/${project.id}/settings/datasources?name=${project.friendlyName}`}
                  >
                    Datasource
                  </Menu.Item>
                  <Menu.Item
                    icon={<Icon name="IconWorldWww" size={ICON_SIZE} />}
                    component={Link}
                    href={`/projects/${project.id}/settings/domain?name=${project.friendlyName}`}
                  >
                    Domain
                  </Menu.Item>
                </Box>
              </Collapse>
              {isDexlaAdmin && (
                <Menu.Item
                  icon={<Icon name="IconRefresh" />}
                  color={isDarkTheme ? "teal" : "indigo"}
                  component={Link}
                  href={`/projects/new?company=${company.orgId}&projectId=${project.id}&step=2`}
                >
                  Regenerate Pages
                </Menu.Item>
              )}
              {onDeleteProject && (
                <Menu.Item
                  icon={<Icon name={ICON_DELETE} />}
                  color="red"
                  onClick={deleteProjectFn}
                >
                  Delete
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Box>
    </Col>
  );
}
