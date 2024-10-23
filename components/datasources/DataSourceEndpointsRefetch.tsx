import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { getSwagger } from "@/requests/datasources/queries";
import { useState } from "react";
import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { DataSourceTypes } from "@/requests/datasources/types";
import { Flex, Loader } from "@mantine/core";

type Props = {
  datasourceId: string;
  updated: number;
  type: DataSourceTypes;
};

export const DataSourceEndpointsRefetch = ({
  datasourceId,
  updated,
  type,
}: Props) => {
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const { invalidate: invalidate } = useDataSources(projectId);
  const lastUpdated = new Date(updated).toLocaleString();
  const [loading, setLoading] = useState(false);

  const refetchSwagger = async () => {
    try {
      setLoading(true);

      if (type === "SWAGGER" || type === "SUPABASE") {
        await getSwagger(projectId, datasourceId);
      }

      invalidate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex w="30px" h="30px" display="flex" justify="center" align="center">
      {loading ? (
        <Loader size="xs" />
      ) : (
        <ActionIconDefault
          tooltip={`API last updated: ${lastUpdated}`}
          iconName="IconRefresh"
          onClick={refetchSwagger}
        />
      )}
    </Flex>
  );
};
