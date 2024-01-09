import { createVariable, updateVariable } from "@/requests/variables/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useVariable = () => {
  const router = useRouter();

  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const client = useQueryClient();

  const createVariablesMutation = useMutation({
    mutationKey: ["variables", projectId, pageId],
    mutationFn: async (values: any) => {
      return await createVariable(projectId, {
        ...values,
        pageId,
      });
    },
    onSettled: () => {
      client.refetchQueries(["variables", projectId, pageId]);
    },
    onError: (error) => {
      console.error({ error });
    },
  });

  const updateVariablesMutation = useMutation(
    async ({ id, values }: { id: string; values: any }) => {
      return await updateVariable(id, projectId, {
        ...values,
        pageId,
      });
    },
    {
      onSettled: () => {
        client.refetchQueries(["variables", projectId, pageId]);
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
