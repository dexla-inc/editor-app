import { Icon } from "@/components/Icon";
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
import startCase from "lodash.startcase";
import { PropsWithChildren, useState } from "react";

type SidebarSectionProps = {
  id: string;
  icon: string;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  onClick?: (id: string, isOpen: boolean) => void;
  remove?: (id: string) => void;
  noPadding?: boolean;
};

export default function SidebarSection({
  id,
  icon,
  label,
  initiallyOpened = false,
  children,
  remove,
  noPadding,
}: PropsWithChildren<SidebarSectionProps>) {
  const theme = useMantineTheme();
  const [isExpanded, setIsExpanded] = useState(initiallyOpened);

  const isDarkTheme = theme.colorScheme === "dark";
  const conditionalStyles = noPadding
    ? {
        mx: `-${theme.spacing.md}`,
        mt: noPadding ? 0 : "md",
      }
    : {};
  return (
    <>
      <Group
        spacing="xs"
        px="md"
        {...conditionalStyles}
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
          onClick={() => setIsExpanded((prev) => !prev)}
          sx={{
            fontWeight: 500,
            display: "block",
            width: "100%",
          }}
          py="xs"
        >
          <Group position="apart" spacing={0} noWrap>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: `${theme.spacing.sm}`,
              }}
            >
              <ThemeIcon
                color="teal"
                variant={isDarkTheme ? "default" : "light"}
                size={30}
              >
                <Icon name={icon} size={ICON_SIZE} />
              </ThemeIcon>
              <Text size="xs">{startCase(label)}</Text>
            </Box>
            {children && (
              <IconChevronDown
                size={ICON_SIZE}
                stroke={1.5}
                style={{
                  transition: "transform 200ms ease",
                  transform: isExpanded ? `none` : "rotate(-90deg)",
                }}
              />
            )}
          </Group>
        </UnstyledButton>
        <Tooltip label="Delete" withArrow color="red">
          <ActionIcon
            onClick={() => remove!(id)}
            color="red"
            variant="light"
            radius="xl"
          >
            <IconTrash size={ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {children ? (
        <Collapse in={isExpanded}>
          <Box {...(noPadding ? {} : { px: "md" })}>{children}</Box>
        </Collapse>
      ) : null}
    </>
  );
}
