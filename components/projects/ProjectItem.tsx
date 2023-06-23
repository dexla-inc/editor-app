import { deleteProject } from "@/requests/projects/mutations";
import {
  PageResponse,
  ProjectResponse,
  getPageList,
} from "@/requests/projects/queries";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Box,
  Col,
  Flex,
  MantineTheme,
  Menu,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconDots,
  IconFileAnalytics,
  IconHome,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

type ProjectItemProps = {
  project: ProjectResponse;
  theme: MantineTheme;
  buttonHoverStyles: any;
  isLoading: boolean;
  goToEditor: (projectId: string, pageId: string) => Promise<void>;
  onDeleteProject: (id: string) => void;
};

export function ProjectItem({
  project,
  theme,
  buttonHoverStyles,
  isLoading,
  goToEditor,
  onDeleteProject,
}: ProjectItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [pagesLoading, setPagesLoading] = useState(false);

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
            <Text>{project.region.name}</Text>
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
              <Menu.Label>Pages</Menu.Label>
              {pages.map((page) => {
                return (
                  <Skeleton key={page.id} visible={pagesLoading}>
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
                  </Skeleton>
                );
              })}
              <Menu.Label>Project</Menu.Label>
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
