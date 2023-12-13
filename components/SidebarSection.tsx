import { useEditorStore } from "@/stores/editor";
import { DARK_COLOR, HOVERED } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown, IconTrash } from "@tabler/icons-react";
import { PropsWithChildren, useState } from "react";

type SidebarSectionProps = {
  id: string;
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  onClick?: (id: string, isOpen: boolean) => void;
  isAction?: boolean;
  removeAction?: (id: string) => void;
};

export function SidebarSection({
  id,
  icon: Icon,
  label,
  initiallyOpened,
  children,
  onClick,
  isAction,
  removeAction,
}: PropsWithChildren<SidebarSectionProps>) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(initiallyOpened || false);

  const setOpenAction = useEditorStore((state) => state.setOpenAction);

  const handleSectionClick = () => {
    setOpened((o) => !o);
    onClick && onClick(id, !opened);
    setOpenAction({ actionId: undefined, componentId: undefined });
  };

  return (
    <>
      <Group
        noWrap
        sx={{
          color: theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark" ? DARK_COLOR : HOVERED,
            color: theme.black,
          },
        }}
      >
        <UnstyledButton
          onClick={handleSectionClick}
          sx={{
            fontWeight: 500,
            display: "block",
            width: "100%",
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          }}
        >
          <Group position="apart" spacing={0} noWrap>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon color="teal" variant="light" size={30}>
                <Icon size={ICON_SIZE} />
              </ThemeIcon>
              <Text size="xs" ml="md">
                {label}
              </Text>
            </Box>
            {children && (
              <IconChevronDown
                size={ICON_SIZE}
                stroke={1.5}
                style={{
                  transition: "transform 200ms ease",
                  transform: opened ? `none` : "rotate(-90deg)",
                }}
              />
            )}
          </Group>
        </UnstyledButton>
        {isAction && (
          <Tooltip label="Delete" withArrow color="red">
            <ActionIcon
              onClick={() => removeAction!(id)}
              color="red"
              variant="light"
              radius="xl"
            >
              <IconTrash size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      {children ? (
        <Collapse in={opened}>
          <Box px="md">{children}</Box>
        </Collapse>
      ) : null}
    </>
  );
}
