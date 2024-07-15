import { Sections } from "@/components/navbar/EditorNavbarSections";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import {
  DARK_COLOR,
  DARK_MODE,
  LIGHT_MODE,
  scrollbarStyles,
} from "@/utils/branding";
import {
  HEADER_HEIGHT,
  ICON_SIZE,
  NAVBAR_MIN_WIDTH,
  NAVBAR_WIDTH,
} from "@/utils/config";
import {
  ActionIcon,
  Flex,
  Group,
  Portal,
  Stack,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconArrowsDiagonal2,
  IconArrowsDiagonalMinimize,
  IconPinned,
  IconPinnedOff,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import startCase from "lodash.startcase";
import { memo, PropsWithChildren, useEffect } from "react";

type Props = {
  sections: Sections;
};

export const NavbarSectionComponent = ({
  children,
  sections,
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const activeTab = useEditorStore((state) => state.activeTab);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setPinTab = useUserConfigStore((state) => state.setIsTabPinned);
  const setNavbarWidth = useUserConfigStore((state) => state.setNavbarWidth);
  const collapsedItemsCount = useEditorStore(
    (state) => state.collapsedItemsCount,
  );
  const setCollapsedItemsCount = useEditorStore(
    (state) => state.setCollapsedItemsCount,
  );
  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );
  const setIsStructureCollapsed = useEditorStore(
    (state) => state.setIsStructureCollapsed,
  );

  const { ref } = useHover();

  const hasCollapsedItems = collapsedItemsCount > 0;

  const IconToggle = isTabPinned ? IconPinnedOff : IconPinned;
  const IconCollapse =
    isStructureCollapsed && hasCollapsedItems
      ? IconArrowsDiagonal2
      : IconArrowsDiagonalMinimize;

  useEffect(() => {
    isTabPinned && setActiveTab("layers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabPinned]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [activeTab, ref]);

  const currentSection = sections.find((section) => section.id === activeTab);

  const sectionToRender = sections.map(({ id, label, icon: Icon }) => {
    const handleSectionClick = () => {
      if (isTabPinned && activeTab === id) {
        setActiveTab("layers");
      } else if (activeTab === id) {
        setActiveTab(undefined);
      } else {
        setActiveTab(id);
      }
    };

    const isDarkTheme = theme.colorScheme === "dark";

    return (
      <Tooltip withinPortal withArrow key={label} label={label} zIndex={500}>
        <UnstyledButton
          onClick={handleSectionClick}
          sx={{
            fontWeight: 500,
            display: "block",
            width: "100%",
          }}
        >
          <ThemeIcon
            color={activeTab === id ? "indigo" : "teal"}
            variant={isDarkTheme ? "default" : "light"}
            sx={
              isDarkTheme && activeTab === id
                ? { color: DARK_COLOR, background: theme.white }
                : {}
            }
            size={30}
          >
            <Icon size={ICON_SIZE} />
          </ThemeIcon>
        </UnstyledButton>
      </Tooltip>
    );
  });

  const actionButtons = (
    <Flex>
      <Tooltip
        label={
          isStructureCollapsed && hasCollapsedItems
            ? "Expand All"
            : "Collapse All"
        }
        fz="xs"
        position="top"
        withArrow
        withinPortal
      >
        <ActionIcon aria-label="collapseTab">
          <IconCollapse
            style={{ transform: "rotate(45deg)" }}
            onClick={() => {
              setIsStructureCollapsed(!isStructureCollapsed);
              setCollapsedItemsCount(isStructureCollapsed ? 0 : 1);
            }}
            size={ICON_SIZE}
            color="gray"
          />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        label={isTabPinned ? "Unpin Tab" : "Pin Tab"}
        fz="xs"
        position="top"
        withArrow
        withinPortal
      >
        <ActionIcon aria-label="PinTab">
          <IconToggle
            onClick={() => {
              setPinTab(!isTabPinned);
              setNavbarWidth(isTabPinned ? NAVBAR_MIN_WIDTH : NAVBAR_WIDTH);
            }}
            size={ICON_SIZE}
            color="gray"
          />
        </ActionIcon>
      </Tooltip>
    </Flex>
  );

  const itemTab = (
    <Stack
      ref={ref}
      sx={(theme) =>
        merge(
          {
            background: theme.colorScheme === "dark" ? DARK_MODE : LIGHT_MODE,
          },
          scrollbarStyles,
        )
      }
      pos="fixed"
      top={HEADER_HEIGHT}
      left={NAVBAR_MIN_WIDTH}
      w={NAVBAR_WIDTH}
      h={`calc(100vh - ${HEADER_HEIGHT}px )`}
      spacing="xs"
      align="flex-start"
    >
      <Flex justify="space-between" w="100%" p="xs" pb={0}>
        <Title
          align="center"
          sx={(theme) => ({
            color: theme.colorScheme === "dark" ? LIGHT_MODE : DARK_COLOR,
          })}
          order={5}
        >
          {startCase(currentSection?.label)}
        </Title>
        {activeTab === "layers" && actionButtons}
      </Flex>
      <Stack spacing={2} w="100%" h="100%">
        {children}
      </Stack>
    </Stack>
  );

  return (
    <Group dir="column" align="flex-start" noWrap px="xs">
      <Group
        h={`100%`}
        align="flex-start"
        pos="relative"
        sx={{ zIndex: 100 }}
        id="navbar-sections"
      >
        <Stack w="100%" h="100%" spacing="md">
          {sectionToRender}
        </Stack>
        {(activeTab || (isTabPinned && activeTab === "layers")) && (
          <Portal target="#navbar-sections">{itemTab}</Portal>
        )}
      </Group>
    </Group>
  );
};

export const NavbarSection = memo(NavbarSectionComponent);
