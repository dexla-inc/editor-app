import { Card, Flex, Stack, Text } from "@mantine/core";

export const NotImplement = (props: any) => {
  return (
    <Card withBorder w="100%" h="100%">
      <Flex w="100%" h="100%" justify="center" align="center">
        <Stack w="100%" align="center" spacing={2}>
          <Text size="sm">{props.name}</Text>
          <Text size="xs" color="dimmed">
            Not implemented yet
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
};
