import { Icon } from "@/components/Icon";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { PageResponse } from "@/requests/pages/types";
import { deleteProject } from "@/requests/projects/mutations";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { ICON_DELETE, ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Box,
  Collapse,
  Loader,
  Menu,
  NavLink,
  UnstyledButton,
  useMantineTheme,
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
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  projectFriendlyName: string;
  goToEditor: (projectId: string, pageId: string) => Promise<void>;
  onDeleteProject?: (id: string) => void;
};

export function ProjectItemMenu({
  projectId,
  projectFriendlyName,
  goToEditor,
  onDeleteProject,
}: Props) {
  const theme = useMantineTheme();
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [menuOpened, setMenuOpened] = useState(false);
  const [pagesOpened, setPagesOpened] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const company = usePropelAuthStore((state) => state.activeCompany);
  const isDexlaAdmin = usePropelAuthStore((state) => state.isDexlaAdmin);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpened(true);
  };

  const handleMenuClose = () => {
    setMenuOpened(false);
    invalidate();
  };

  const {
    data: pageListQuery,
    isLoading,
    isError,
    invalidate,
  } = usePageListQuery(projectId, null, menuOpened);

  useEffect(() => {
    if (!isLoading && !isError && pageListQuery) {
      setPages(pageListQuery.results || []);
    }
  }, [pageListQuery, isLoading, isError]);

  const deleteProjectFn = async () => {
    setIsDeleting(true);
    await deleteProject(projectId);
    onDeleteProject && onDeleteProject(projectId);
    setPages([]);
  };

  const isDarkTheme = theme.colorScheme === "dark";

  return (
    <Menu
      width={250}
      withArrow
      offset={20}
      onOpen={handleMenuOpen}
      onClose={handleMenuClose}
    >
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
          {isDeleting ? (
            <Loader size="sm" />
          ) : (
            <IconDots size={LARGE_ICON_SIZE} color={theme.colors.teal[5]} />
          )}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Project</Menu.Label>
        <NavLink
          label="Pages"
          icon={<IconFileAnalytics size={ICON_SIZE} />}
          rightSection={
            pagesOpened ? (
              <IconChevronDown size={ICON_SIZE} />
            ) : (
              <IconChevronRight size={ICON_SIZE} />
            )
          }
          onClick={() => setPagesOpened((isOpen) => !isOpen)}
        />
        <Collapse in={pagesOpened}>
          {pages.map((page) => {
            return (
              <Box key={page.id} ml={10}>
                <Menu.Item
                  icon={
                    page.isHome ? (
                      <IconHome size={ICON_SIZE} />
                    ) : (
                      <IconFileAnalytics size={ICON_SIZE} />
                    )
                  }
                  onClick={() => goToEditor(projectId, page.id)}
                >
                  {page.title}
                </Menu.Item>
              </Box>
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
              href={`/projects/${projectId}/settings?name=${projectFriendlyName}`}
            >
              General
            </Menu.Item>
            <Menu.Item
              icon={<Icon name="IconDatabase" size={ICON_SIZE} />}
              component={Link}
              href={`/projects/${projectId}/settings/datasources?name=${projectFriendlyName}`}
            >
              Datasource
            </Menu.Item>
            <Menu.Item
              icon={<Icon name="IconWorldWww" size={ICON_SIZE} />}
              component={Link}
              href={`/projects/${projectId}/settings/domain?name=${projectFriendlyName}`}
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
            href={`/projects/new?company=${company.orgId}&projectId=${projectId}&step=2`}
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
  );
}
