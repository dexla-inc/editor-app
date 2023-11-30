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
import { Icon } from "../Icon";

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
  return (
    <Tooltip label={tooltip} disabled={tooltip === undefined}>
      <UnstyledButton
        {...props}
        sx={(theme) => ({
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          border: `1px solid ${
            color === "teal" ? theme.colors.teal[6] : theme.colors.gray[3]
          }`,
          color: color === "teal" ? theme.white : theme.black,
          backgroundColor:
            color === "teal" ? theme.colors.teal[6] : theme.white,

          "&:hover": {
            backgroundColor:
              color === "teal" ? theme.colors.teal[7] : theme.colors.gray[0],
          },
        })}
        onClick={onClick}
      >
        <Flex gap="md" align="center">
          <Icon
            name={icon}
            size={LARGE_ICON_SIZE}
            color={color === "teal" ? theme.white : theme.colors.teal[6]}
          />
          <Box
            sx={{
              width: width,
            }}
          >
            <Text size="lg">{title}</Text>
            <Text
              size="xs"
              color={color === "teal" ? theme.white : theme.colors.gray[6]}
            >
              {description}
            </Text>
          </Box>
        </Flex>
      </UnstyledButton>
    </Tooltip>
  );
}
