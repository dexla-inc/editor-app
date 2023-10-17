import { Sections } from "@/components/navbar/EditorNavbarSections";
import { useEditorStore } from "@/stores/editor";
import { HEADER_HEIGHT, ICON_SIZE } from "@/utils/config";
import {
  Group,
  Stack,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import startCase from "lodash.startcase";
import { PropsWithChildren } from "react";

type Props = {
  sections: Sections;
};

export const NavbarSection = ({
  children,
  sections,
}: PropsWithChildren<Props>) => {
  const { activeTab, setActiveTab } = useEditorStore();

  const handleClick = (id: string) => {
    activeTab === id ? setActiveTab(undefined) : setActiveTab(id);
  };

  const sectionToRender = sections.map(({ id, label, icon: Icon }) => {
    return (
      <Tooltip
        withinPortal
        position="right"
        fz={10}
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

      {activeTab && (
        <Stack
          sx={{
            overflow: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 transparent",
            msOverflowStyle: "-ms-autohiding-scrollbar",
            ":hover": { overflowY: "auto" },
            "::-webkit-scrollbar": { width: "5px", borderRadius: "50%" },
            "::-webkit-scrollbar-thumb": { backgroundColor: "#888" },
          }}
          w={250}
          h="100%"
          spacing="xs"
          align="flex-start"
          pr={10}
        >
          <Title align="center" w="100%" color="dark.4" order={4}>
            {startCase(activeTab)}
          </Title>
          {children}
        </Stack>
      )}
    </Group>
  );
};
