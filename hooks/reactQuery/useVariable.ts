import { createVariable, updateVariable } from "@/requests/variables/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVariable = (projectId: string) => {
  const client = useQueryClient();
  const queryKey = ["variables", projectId];

  const createVariablesMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (values: any) => {
      return await createVariable(projectId, {
        ...values,
      });
    },
    onSettled: () => {
      client.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error({ error });
    },
  });

  const updateVariablesMutation = useMutation(
    async ({ id, values }: { id: string; values: any }) => {
      return await updateVariable(id, projectId, {
        ...values,
      });
    },
    {
      onSettled: () => {
        client.refetchQueries(queryKey);
      },
      onError: (error) => {
        console.error({ error });
      },
    },
  );

  return {
    createVariablesMutation,
    updateVariablesMutation,
  };
};
