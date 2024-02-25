import { Card, Text, useMantineTheme } from "@mantine/core";

export default function DataItemValuePreview({ value }: { value: string }) {
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor][6];
  return (
    <Card padding={4} maw={350}>
      <Text size="xs" color={primaryColor} truncate>
        {value}
      </Text>
    </Card>
  );
}
