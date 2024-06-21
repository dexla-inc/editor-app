import { Pagination, Stack, Text } from "@mantine/core";
import { usePageStateHistory } from "@/hooks/editor/reactQuery/usePageStateHistory";
import { useEditorTreeStore } from "@/stores/editorTree";
import { LARGE_ICON_SIZE } from "@/utils/config";
import { useCallback, useState } from "react";
import { Icon } from "../Icon";
import { rollbackState } from "@/requests/pages/mutations";
import { decodeSchema } from "@/utils/compression";
import { PageHistoryItem } from "./PageHistoryItem";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

type Props = {};

export const HistoryPageSection = ({}: Props) => {
  const { id: projectId, page: pageId } = useEditorParams();
  const [activePage, setActivePage] = useState(1);
  const limit = 10;
  const offset = (activePage - 1) * limit;
  const {
    data: pageStatesHistories,
    invalidate,
    isLoading,
  } = usePageStateHistory(projectId, pageId, offset, limit);

  const setTree = useEditorTreeStore((state) => state.setTree);

  const handleRollbackPageState = useCallback(
    async (id: string) => {
      try {
        const result = await rollbackState(projectId, pageId, "page", id);
        const decodedSchema = decodeSchema(result.state);
        const parsedTree = JSON.parse(decodedSchema);

        setTree(parsedTree, {
          action: "Reverted page",
        });
        invalidate();
      } catch (error) {
        console.error("Error rolling back: ", error);
      }
    },
    [invalidate, pageId, projectId, setTree],
  );

  return (
    <Stack spacing="xl">
      {isLoading || pageStatesHistories?.results.length === 0 ? (
        <Stack align="center" mt="xl">
          <Icon name="IconHistory" size={LARGE_ICON_SIZE} />
          <Text>No history found</Text>
        </Stack>
      ) : (
        <Stack>
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={Math.ceil(
              (pageStatesHistories?.paging.totalRecords ?? 0) / limit,
            )}
            size="xs"
          />
          {pageStatesHistories?.results.map((history, index) => (
            <PageHistoryItem
              key={history.id ?? index}
              history={history}
              onRollback={handleRollbackPageState}
              index={index}
            />
          ))}
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={Math.ceil(
              (pageStatesHistories?.paging.totalRecords ?? 0) / limit,
            )}
            size="xs"
          />
        </Stack>
      )}
    </Stack>
  );
};
