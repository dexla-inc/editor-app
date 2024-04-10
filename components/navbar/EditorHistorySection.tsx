import { ActionIconDefault } from "@/components/ActionIconDefault";
import { AssetImages } from "@/components/storage/AssetImages";
import { usePageStateHistory } from "@/hooks/reactQuery/usePageStateHistory";
import { useStorageQuery } from "@/hooks/reactQuery/useStorageQuery";
import { uploadFile } from "@/requests/storage/mutations";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Card,
  FileButton,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "../Icon";
import { PageStateHistoryResponse } from "@/requests/pages/types";
import { rollbackPageState } from "@/requests/pages/mutations";
import { useEditorTreeStore } from "@/stores/editorTree";
import { decodeSchema } from "@/utils/compression";
import { queryClient } from "@/utils/reactQuery";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const EditorHistorySection = () => {
  const router = useRouter();
  const { id: projectId, page: pageId } = router.query as {
    id: string;
    page: string;
  };
  const initialTimestamp = Date.now() - ONE_DAY_MS;
  const [date, setDate] = useState(new Date(initialTimestamp));
  const [timestamp, setTimestamp] = useState<number>(initialTimestamp);
  const { data: pageStatesHistories, isLoading } = usePageStateHistory(
    projectId,
    pageId,
    timestamp,
  );

  const setTree = useEditorTreeStore((state) => state.setTree);

  useEffect(() => {
    setTimestamp(date.getTime());
  }, [date]);

  // Handler for DateInput change
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const queryKey = ["page-state-history", projectId, pageId, timestamp];

  const handleRollbackPageState = useCallback(
    async (id: string) => {
      try {
        const result = await rollbackPageState(projectId, pageId, id);
        const decodedSchema = decodeSchema(result.state);
        const parsedTree = JSON.parse(decodedSchema);

        setTree(parsedTree);
        queryClient.setQueryData(queryKey, (oldData?: any) => {
          if (!oldData || !oldData.results) {
            return { results: [result] };
          }

          return {
            ...oldData,
            results: [
              { ...result, description: "Reverted page state" },
              ...oldData.results,
            ],
          };
        });
      } catch (error) {
        console.error("Error rolling back: ", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId],
  );

  return (
    <Stack spacing="xs" pl="xs">
      <LoadingOverlay
        visible={isLoading}
        overlayOpacity={0.3}
        loaderProps={{ variant: "dots" }}
      />
      <DateInput
        size="xs"
        value={date}
        onChange={handleDateChange}
        label="From"
      />
      {isLoading || pageStatesHistories?.results.length === 0 ? (
        <Stack align="center" mt="xl">
          <Icon name="IconHistory" size={LARGE_ICON_SIZE} />
          <Text>No history found</Text>
        </Stack>
      ) : (
        <Stack>
          {pageStatesHistories?.results.map((history, index) => (
            <PageHistoryItem
              key={history.id ?? index}
              history={history}
              onRollback={handleRollbackPageState}
              index={index}
            />
          ))}
          {/* <Pagination value={activePage} onChange={setPage} total={10} />; */}
        </Stack>
      )}
    </Stack>
  );
};

type Props = {
  history: PageStateHistoryResponse;
  onRollback: (id: string) => void;
  index: number;
};

const PageHistoryItem = ({ history, onRollback, index }: Props) => {
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
