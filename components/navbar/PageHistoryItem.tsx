import { ActionIconDefault } from "@/components/ActionIconDefault";
import { Card, Flex, Stack, Text } from "@mantine/core";
import { PageStateHistoryResponse } from "@/requests/pages/types";

type Props = {
  history: PageStateHistoryResponse;
  onRollback: (id: string) => void;
  index: number;
};

export const PageHistoryItem = ({ history, onRollback, index }: Props) => {
  return (
    <Card p="xs" w="100%">
      <Stack>
        <Flex align="center" w="100%" gap="xs" justify="space-between">
          <Text size="xs" fw={500}>
            {history.description ?? "Need to add description"}
          </Text>
          <ActionIconDefault
            iconName="IconArrowBack"
            tooltip="Revert to version"
            onClick={() => onRollback(history.id)}
          />
        </Flex>
        <Flex align="center" gap="xs" justify="space-between">
          <Text size="xs" color="dimmed">
            {new Date(history.created).toLocaleString()}
          </Text>
          {index === 0 && (
            <Text size="xs" color="dimmed">
              Current
            </Text>
          )}
        </Flex>
      </Stack>
    </Card>
  );
};
