import { Sections } from "@/components/navbar/EditorNavbarSections";
import { useEditorStore } from "@/stores/editor";
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
  IconDirection,
  IconDirectionsOff,
  IconPinned,
  IconPinnedOff,
} from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { PropsWithChildren } from "react";

type Props = {
  sections: Sections;
  layers: any;
};

export const NavbarSection = ({
  children,
  sections,
  layers,
}: PropsWithChildren<Props>) => {
  const {
    activeTab,
    setActiveTab,
    pinTab,
    setPinTab,
    isStructureCollapsed,
    setIsStructureCollapsed,
  } = useEditorStore();

  const pinnedItem = sections.find((item) => item.id === "layers");

  const IconToggle = pinTab ? IconPinnedOff : IconPinned;
  const IconCollapse = isStructureCollapsed ? IconDirection : IconDirectionsOff;

  const handleClick = (id: string) => {
    activeTab === id ? setActiveTab(undefined) : setActiveTab(id);
  };

  const sectionToRender = sections.map(({ id, label, icon: Icon }) => {
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
          onClick={() => handleClick(id)}
          sx={{
            fontWeight: 500,
            display: "block",
            width: "100%",
          }}
        >
          <ThemeIcon color="teal" variant="light" size={30}>
            <Icon size={ICON_SIZE} />
          </ThemeIcon>
        </UnstyledButton>
      </Tooltip>
    );
  });

  const item = sections.find((section) => section.id === activeTab);

  const itemTab = (
    <Stack
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
      left={NAVBAR_MIN_WIDTH}
      w={250}
      h="100%"
      spacing="xs"
      align="flex-start"
    >
      <Flex justify="space-between" w="100%">
        <Title align="center" color="dark.4" order={4}>
          {startCase(item?.label)}
        </Title>
        {activeTab === "layers" && (
          <Tooltip
            label={pinTab ? "Unpin Tab" : "Pin Tab"}
            fz={10}
            position="top"
            withArrow
            withinPortal
          >
            <ActionIcon aria-label="PinTab">
              <IconToggle
                onClick={() => {
                  setPinTab(!pinTab);
                  setActiveTab(undefined);
                }}
                size={ICON_SIZE}
                color="gray"
              />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
      <Stack align="flex-start" w="100%">
        {children}
      </Stack>
    </Stack>
  );

  return (
    <Group
      dir="column"
      align="flex-start"
      noWrap
      px="xs"
      h={`calc(95vh - ${HEADER_HEIGHT}px)`}
    >
      <Group
        align="flex-start"
        pos="relative"
        sx={{ zIndex: 100 }}
        id="navbar-sections"
      >
        <Stack h="100%" spacing="md">
          {sectionToRender}
        </Stack>
        {activeTab && <Portal target="#navbar-sections">{itemTab}</Portal>}
      </Group>
      {pinTab && pinnedItem && (
        <Stack w={250} h="100%" spacing="xs" align="flex-start">
          <Flex justify="space-between" w="100%">
            <Title align="center" color="dark.4" order={4}>
              {startCase(pinnedItem?.label)}
            </Title>
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
                    onClick={() =>
                      setIsStructureCollapsed(!isStructureCollapsed)
                    }
                    size={ICON_SIZE}
                    color="gray"
                  />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={pinTab ? "Unpin Tab" : "Pin Tab"}
                fz="xs"
                position="top"
                withArrow
                withinPortal
              >
                <ActionIcon aria-label="PinTab">
                  <IconToggle
                    onClick={() => {
                      setPinTab(!pinTab);
                      setActiveTab(undefined);
                    }}
                    size={ICON_SIZE}
                    color="gray"
                  />
                </ActionIcon>
              </Tooltip>
            </Flex>
          </Flex>
          {layers({ ...item })}
        </Stack>
      )}
    </Group>
  );
};
