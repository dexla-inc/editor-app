import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { getSwagger } from "@/requests/datasources/queries";
import { Dispatch, SetStateAction } from "react";
import { ActionIconDefault } from "../ActionIconDefault";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { DataSourceTypes } from "@/requests/datasources/types";

type Props = {
  datasourceId: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  updated: number;
  baseUrl: string;
  apiKey: string;
  type: DataSourceTypes;
};

export const DataSourceEndpointsRefetch = ({
  datasourceId,
  setIsLoading,
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

  // refactor this as we support more types
  const relativeUrl = type === "SUPABASE" ? "/rest/v1/" : "/";

  const refetchSwagger = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <ActionIconDefault
      tooltip={`API last updated: ${lastUpdated}`}
      iconName="IconRefresh"
      onClick={refetchSwagger}
    />
  );
};
