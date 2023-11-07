import { Sections } from "@/components/navbar/EditorNavbarSections";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { HEADER_HEIGHT, ICON_SIZE, NAVBAR_MIN_WIDTH } from "@/utils/config";
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
} from "@mantine/core";
import {
  IconArrowsDiagonal2,
  IconArrowsDiagonalMinimize,
  IconPinned,
  IconPinnedOff,
} from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { PropsWithChildren, useEffect } from "react";

type Props = {
  sections: Sections;
};

export const NavbarSection = ({
  children,
  sections,
}: PropsWithChildren<Props>) => {
  const activeTab = useEditorStore((state) => state.activeTab);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setPinTab = useUserConfigStore((state) => state.setIsTabPinned);
  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );
  const setIsStructureCollapsed = useEditorStore(
    (state) => state.setIsStructureCollapsed,
  );
  const setIsPageStructure = useEditorStore(
    (state) => state.setIsPageStructure,
  );

  const IconToggle = isTabPinned ? IconPinnedOff : IconPinned;
  const IconCollapse = isStructureCollapsed
    ? IconArrowsDiagonal2
    : IconArrowsDiagonalMinimize;

  useEffect(() => {
    isTabPinned && setActiveTab("layers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabPinned]);

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

    return (
      <Tooltip
        withinPortal
        position="right"
        fz="xs"
        withArrow
        key={label}
        label={label}
        zIndex={500}
      >
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
            variant="light"
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
        label={isStructureCollapsed ? "Expand All" : "Collapse All"}
        fz="xs"
        position="top"
        withArrow
        withinPortal
      >
        <ActionIcon aria-label="collapseTab">
          <IconCollapse
            style={{ transform: "rotate(45deg)" }}
            onClick={() => setIsStructureCollapsed(!isStructureCollapsed)}
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
      onMouseEnter={() => setIsPageStructure(true)}
      onMouseLeave={() => setIsPageStructure(false)}
      sx={{
        overflowX: "hidden",
        overflowY: "scroll",
        scrollbarWidth: "thin",
        scrollbarColor: "#888 transparent",
        msOverflowStyle: "-ms-autohiding-scrollbar",
        "::-webkit-scrollbar": { width: "5px", borderRadius: "10px" },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "10px",
        },
      }}
      pos="fixed"
      bg="white"
      top={HEADER_HEIGHT}
      p={10}
      pb={80}
      left={NAVBAR_MIN_WIDTH}
      w={250}
      h="100%"
      spacing="xs"
      align="flex-start"
    >
      <Flex justify="space-between" w="100%">
        <Title align="center" color="dark.4" order={4}>
          {startCase(currentSection?.label)}
        </Title>
        {activeTab === "layers" && actionButtons}
      </Flex>
      <Stack align="flex-start" w="100%">
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
        <Stack h="100%" spacing="md">
          {sectionToRender}
        </Stack>
        {(activeTab || (isTabPinned && activeTab === "layers")) && (
          <Portal target="#navbar-sections">{itemTab}</Portal>
        )}
      </Group>
    </Group>
  );
};
