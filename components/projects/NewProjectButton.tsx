import { Group, Text, UnstyledButton, useMantineTheme } from "@mantine/core";

type IconTitleDescriptionButtonProps = {
  icon: JSX.Element;
  title: string;
  description: string;
};

export default function IconTitleDescriptionButton({
  icon,
  title,
  description,
}: IconTitleDescriptionButtonProps) {
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      sx={{
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        border: "1px solid " + theme.colors.gray[2],
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      }}
    >
      <Group>
        {icon}
        <div>
          <Text>{title}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
