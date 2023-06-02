import { Avatar, Card, Group, Text, useMantineTheme } from "@mantine/core";

export const AppBar = () => {
  const theme = useMantineTheme();
  return (
    <Card
      w="100%"
      radius={0}
      sx={{ borderBottom: `1px solid ${theme.colors.gray[3]}` }}
    >
      <Group position="apart" w="100%">
        <Text size="sm">My Company</Text>
        <Avatar src={null} color="blue" radius="xl" />
      </Group>
    </Card>
  );
};
