import { Sections } from "@/components/navbar/EditorNavbarSections";
import { useEditorStore } from "@/stores/editor";
import { HEADER_HEIGHT, ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Flex,
  Group,
  Stack,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconPinned, IconPinnedOff } from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { PropsWithChildren } from "react";

type Props = {
  sections: Sections;
};

export const NavbarSection = ({
  children,
  sections,
}: PropsWithChildren<Props>) => {
  const { activeTab, setActiveTab, pinTab, setPinTab } = useEditorStore();

  const IconToggle = pinTab ? IconPinnedOff : IconPinned;

  const handleClick = (id: string) => {
    if (pinTab) return;
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

  return (
    <Group
      dir="column"
      align="flex-start"
      noWrap
      px="xs"
      h={`calc(95vh - ${HEADER_HEIGHT}px)`}
    >
      <Stack pos="relative" h="100%" spacing="md">
        {sectionToRender}
      </Stack>

      {(activeTab || pinTab) && (
        <Stack
          sx={{
            overflow: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 transparent",
            msOverflowStyle: "-ms-autohiding-scrollbar",
            ":hover": { overflowY: "auto" },
            "::-webkit-scrollbar": { width: "5px", borderRadius: "10px" },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
          }}
          w={250}
          h="100%"
          spacing="xs"
          align="flex-start"
          pr={10}
        >
          <Flex justify="space-between" w="100%">
            <Title align="center" color="dark.4" order={4}>
              {startCase(activeTab)}
            </Title>
            <Tooltip
              label={pinTab ? "Unpin Tab" : "Pin Tab"}
              fz="xs"
              position="top"
              withArrow
              withinPortal
            >
              <ActionIcon aria-label="PinTab">
                <IconToggle
                  onClick={() => setPinTab(!pinTab)}
                  size={ICON_SIZE}
                  color="gray"
                />
              </ActionIcon>
            </Tooltip>
          </Flex>
          {children}
        </Stack>
      )}
    </Group>
  );
};
