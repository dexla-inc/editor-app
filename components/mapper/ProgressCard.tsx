import { Card, Center, RingProgress, Text } from "@mantine/core";

export const ProgressCard = () => {
  return (
    <Card w="100%" withBorder>
      <Center>
        <RingProgress
          sections={[{ value: 40, color: "blue" }]}
          label={
            <Text color="blue" weight={700} align="center" size="xl">
              40%
            </Text>
          }
        />
      </Center>
    </Card>
  );
};
