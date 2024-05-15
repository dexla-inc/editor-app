import { usePageStateHistory } from "@/hooks/editor/reactQuery/usePageStateHistory";
import { LARGE_ICON_SIZE } from "@/utils/config";
import { LoadingOverlay, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "../Icon";
import { rollbackPageState } from "@/requests/pages/mutations";
import { useEditorTreeStore } from "@/stores/editorTree";
import { decodeSchema } from "@/utils/compression";
import { queryClient } from "@/utils/reactQuery";
import { PageHistoryItem } from "./PageHistoryItem";

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
