import { Icon } from "@/components/Icon";
import { OpenAction, useEditorStore } from "@/stores/editor";
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
import { PropsWithChildren } from "react";

type SidebarSectionProps = {
  id: string;
  icon: string;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  onClick?: (id: string, isOpen: boolean) => void;
  isAction?: boolean;
  removeAction?: (id: string) => void;
  componentId?: string;
  openAction?: OpenAction;
  isSequential?: boolean;
  noPadding?: boolean;
};

export default function SidebarSection({
  id,
  icon,
  label,
  initiallyOpened: isExpanded = false,
  children,
  onClick,
  isAction,
  removeAction,
  componentId,
  openAction,
  isSequential,
  noPadding,
}: PropsWithChildren<SidebarSectionProps>) {
  const theme = useMantineTheme();

  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const isActionTarget =
    openAction?.actionIds?.includes(id) ||
    openAction?.actionIds?.includes(`seq_${id}`);
  const isActionSequentialTarget = openAction?.actionIds?.includes(`seq_${id}`);
  const canAddActionToList =
    openAction?.componentId === componentId && isSequential;
  const newActionIds = openAction?.actionIds?.filter(
    (actionId) => actionId !== `seq_${id}`,
  );

  const handleSectionClick = () => {
    onClick && onClick(id, !isExpanded);
    setOpenAction(
      isActionTarget
        ? isActionSequentialTarget
          ? { ...openAction, actionIds: newActionIds }
          : { actionIds: undefined, componentId: undefined }
        : canAddActionToList
        ? {
            ...openAction,
            actionIds: [...openAction?.actionIds!, `seq_${id}`],
          }
        : { actionIds: [id], componentId },
    );
  };

  const isDarkTheme = theme.colorScheme === "dark";

  return (
    <>
      <Group
        spacing="xs"
        {...(!noPadding ? { pr: "xs" } : { mx: `-${theme.spacing.md}` })}
        {...(isSequential ? { mt: "md" } : {})}
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
              <ThemeIcon
                color="teal"
                variant={isDarkTheme ? "default" : "light"}
                size={30}
              >
                <Icon name={icon} size={ICON_SIZE} />
              </ThemeIcon>
              <Text size="xs" ml="md">
                {startCase(label)}
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
        <Collapse in={isExpanded}>
          <Box {...(!noPadding && { px: "md" })}>{children}</Box>
        </Collapse>
      ) : null}
    </>
  );
}
