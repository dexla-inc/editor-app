import { Pagination, Stack, Text } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useCallback, useState } from "react";
import { useDeploymentPageHistory } from "@/hooks/editor/reactQuery/useDeploymentPageHistory";
import { LARGE_ICON_SIZE } from "@/utils/config";
import { Icon } from "../Icon";
import { HistoryDeploymentItem } from "./HistoryDeploymentItem";
import { decodeSchema } from "@/utils/compression";
import { rollbackState } from "@/requests/pages/mutations";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

export const HistoryDeploymentSection = ({}) => {
  const { id: projectId, page: pageId } = useEditorParams();
  const [activePage, setActivePage] = useState(1);
  const limit = 10;
  const offset = (activePage - 1) * limit;

  const { data: deploymentPageHistories, isLoading } = useDeploymentPageHistory(
    projectId,
    pageId,
    offset,
    limit,
  );

  const setTree = useEditorTreeStore((state) => state.setTree);

  const handleRollbackPageState = useCallback(
    async (id: string) => {
      try {
        const result = await rollbackState(projectId, pageId, "deployment", id);
        const decodedSchema = decodeSchema(result.state);
        const parsedTree = JSON.parse(decodedSchema);

        setTree(parsedTree, {
          action: "Reverted page to deployed state",
        });
      } catch (error) {
        console.error("Error rolling back: ", error);
      }
    },
    [pageId, projectId, setTree],
  );

  return (
    <>
      {isLoading || deploymentPageHistories?.results.length === 0 ? (
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
              (deploymentPageHistories?.paging.totalRecords ?? 0) / limit,
            )}
            size="xs"
          />
          {deploymentPageHistories?.results.map((history, index) => (
            <HistoryDeploymentItem
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
              (deploymentPageHistories?.paging.totalRecords ?? 0) / limit,
            )}
            size="xs"
          />
        </Stack>
      )}
    </>
  );
};
