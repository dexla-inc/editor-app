import { Sections } from "@/components/navbar/EditorNavbarSections";
import { HEADER_HEIGHT, ICON_SIZE } from "@/utils/config";
import {
  Collapse,
  Divider,
  Group,
  Stack,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import startCase from "lodash.startcase";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

type Props = {
  sections: Sections;
  activeTab: string | null;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
};

export const NavbarSection = ({
  children,
  sections,
  activeTab,
  setActiveTab,
}: PropsWithChildren<Props>) => {
  const [opened, { open, close }] = useDisclosure(!!activeTab || false);

  const handleClick = (id: any) => {
    setActiveTab(activeTab === id ? null : id);
    activeTab === id ? close() : open();
  };

  const sectionToRender = sections.map(({ id, label, icon: Icon }) => {
    return (
      <Tooltip fz={10} withArrow key={label} label={label}>
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
      h={`calc(90vh - ${HEADER_HEIGHT}px)`}
    >
      <Stack pos="relative" h="100%" spacing="md">
        {sectionToRender}
      </Stack>

      <Collapse in={opened}>
        <Stack
          w={!!activeTab ? 220 : 0}
          h="100%"
          spacing="xs"
          align="flex-start"
          pr={5}
        >
          <Divider
            my="sm"
            color="gray"
            size="xs"
            w="100%"
            labelPosition="center"
            labelProps={{ size: "md", weight: "bold" }}
            label={startCase(activeTab!)}
          />
          {children}
        </Stack>
      </Collapse>
    </Group>
  );
};
