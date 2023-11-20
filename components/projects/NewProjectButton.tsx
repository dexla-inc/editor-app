import {
  Box,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  UnstyledButtonProps,
  useMantineTheme,
} from "@mantine/core";

type IconTitleDescriptionButtonProps = {
  icon: JSX.Element;
  title: string;
  description: string;
  tooltip?: string;
} & UnstyledButtonProps;

export default function IconTitleDescriptionButton({
  icon,
  title,
  description,
  tooltip,
  ...props
}: IconTitleDescriptionButtonProps) {
  const theme = useMantineTheme();
  return (
    <Tooltip label={tooltip} disabled={tooltip === undefined}>
      <UnstyledButton
        sx={() => ({
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          border: "1px solid " + theme.colors.gray[3],
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
        {...props}
      >
        <Group>
          {icon}
          <Box
            sx={{
              maxWidth: 250,
            }}
          >
            <Text>{title}</Text>
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}
