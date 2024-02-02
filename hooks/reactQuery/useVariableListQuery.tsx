import { PagingResponse } from "@/requests/types";
import { listVariables } from "@/requests/variables/queries-noauth";
import { VariableResponse } from "@/requests/variables/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEditorStore } from "@/stores/editor";

const cacheTime = 30 * 60 * 1000; // 30 minutes

type UseVariableListQueryProps = {
  onSuccess?: (data: VariableResponse[]) => void;
};

export const useVariableListQuery = ({
  onSuccess,
}: UseVariableListQueryProps) => {
  const queryClient = useQueryClient();
  const projectId = useEditorStore((state) => state.currentProjectId);

  const queryKey = ["variables", projectId];

  const queryResult = useQuery<PagingResponse<VariableResponse>, Error>({
    queryKey: queryKey,
    queryFn: () =>
      listVariables(projectId!).then((res) => {
        onSuccess?.(res.results);
        return res;
      }),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
