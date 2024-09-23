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
  baseUrl: string;
  apiKey: string;
  type: DataSourceTypes;
};
// A change for redeployment
export const DataSourceEndpointsRefetch = ({
  datasourceId,
  updated,
  baseUrl,
  apiKey,
  type,
}: Props) => {
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const { invalidate: invalidate } = useDataSources(projectId);
  const lastUpdated = new Date(updated).toLocaleString();
  const accessToken = usePropelAuthStore.getState().accessToken;
  const [loading, setLoading] = useState(false);

  // refactor this as we support more types
  const relativeUrl = type === "SUPABASE" ? "/rest/v1/" : "/";

  const refetchSwagger = async () => {
    try {
      setLoading(true);
      const swaggerResponse = await fetch(
        `/api/swagger2openapi?projectId=${projectId}&baseUrl=${encodeURIComponent(baseUrl)}&relativeUrl=${relativeUrl}&apiKey=${encodeURIComponent(
          apiKey,
        )}&accessToken=${encodeURIComponent(accessToken)}&type=${type}`,
      );

      if (!swaggerResponse.ok) {
        const errorData = await swaggerResponse.json();
        throw new Error(
          errorData.error || "Failed to convert Swagger to OpenAPI",
        );
      }

      await getSwagger(projectId, datasourceId);
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
