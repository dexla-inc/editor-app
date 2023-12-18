import { Icon } from "@/components/Icon";
import {
  DARK_COLOR,
  DARK_MODE,
  GRAY_WHITE_COLOR,
  GREEN_COLOR,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
  THIN_GREEN_OUTLINE,
} from "@/utils/branding";
import { LARGE_ICON_SIZE } from "@/utils/config";
import {
  Box,
  Flex,
  Text,
  Tooltip,
  UnstyledButton,
  UnstyledButtonProps,
  useMantineTheme,
} from "@mantine/core";

type IconTitleDescriptionButtonProps = {
  icon: string;
  title: string;
  description: string;
  tooltip?: string;
  onClick?: () => void;
  color?: "teal" | "white";
  width?: number;
} & UnstyledButtonProps;

export default function IconTitleDescriptionButton({
  icon,
  title,
  description,
  tooltip,
  onClick,
  color = "white",
  width = 220,
  ...props
}: IconTitleDescriptionButtonProps) {
  const theme = useMantineTheme();

  const background = theme.colorScheme === "dark" ? DARK_MODE : theme.white;
  const textColor = theme.colorScheme === "dark" ? GREEN_COLOR : theme.black;
  const _border =
    theme.colorScheme === "dark" ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE;
  const _hover = theme.colorScheme === "dark" ? DARK_COLOR : GRAY_WHITE_COLOR;
  return (
    <Tooltip label={tooltip} disabled={tooltip === undefined}>
      <UnstyledButton
        {...props}
        sx={(theme) => ({
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          border: color === "teal" ? THIN_GREEN_OUTLINE : _border,
          color: color === "teal" ? theme.black : textColor,
          backgroundColor: color === "teal" ? theme.colors.teal[5] : background,

          "&:hover": {
            backgroundColor: color === "teal" ? GREEN_COLOR : _hover,
          },
        })}
        onClick={onClick}
      >
        <Flex gap="md" align="center">
          <Icon
            name={icon}
            size={LARGE_ICON_SIZE}
            color={color === "teal" ? theme.black : theme.colors.teal[6]}
          />
          <Box
            sx={{
              width: width,
            }}
          >
            <Text size="lg">{title}</Text>
            <Text
              size="xs"
              color={
                color === "teal" ? theme.colors.dark[5] : theme.colors.gray[6]
              }
            >
              {description}
            </Text>
          </Box>
        </Flex>
      </UnstyledButton>
    </Tooltip>
  );
}
