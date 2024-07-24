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
import { PropsWithChildren } from "react";
import { useEditorStore } from "@/stores/editor";

type SidebarSectionProps = {
  id: string;
  icon: React.FC<any>;
  label: string;
  isAction?: boolean;
  removeAction?: (id: string) => void;
  isSequential?: boolean;
  noPadding?: boolean;
};

export function SidebarSection({
  id,
  icon: Icon,
  label,
  children,
  isAction,
  removeAction,
  isSequential,
  noPadding,
}: PropsWithChildren<SidebarSectionProps>) {
  const theme = useMantineTheme();
  const selectedPageActionIds = useEditorStore(
    (state) => state.selectedPageActionIds,
  );
  const setSelectedPageActionIds = useEditorStore(
    (state) => state.setSelectedPageActionIds,
  );
  const isExpanded = selectedPageActionIds.includes(id);
  const toggle = () => {
    setSelectedPageActionIds(id);
  };

  const isDarkTheme = theme.colorScheme === "dark";

  return (
    <>
      <Group
        spacing="xs"
        {...(!noPadding ? { pr: "xs" } : { mx: `-${theme.spacing.sm}` })}
        {...(isSequential ? { mt: "sm" } : {})}
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
          onClick={toggle}
          sx={{
            fontWeight: 500,
            display: "block",
            width: "100%",
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          }}
        >
          <Group position="apart" spacing={0} noWrap>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon
                color="teal"
                variant={isDarkTheme ? "default" : "light"}
                size={30}
              >
                <Icon size={ICON_SIZE} />
              </ThemeIcon>
              <Text size="xs" ml="sm">
                {label}
              </Text>
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
        {isAction && (
          <Tooltip label="Delete" withArrow color="red">
            <ActionIcon
              onClick={() => removeAction?.(id)}
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
        <Collapse in={isExpanded}>
          <Box pl="xs">{children}</Box>
        </Collapse>
      ) : null}
    </>
  );
}
