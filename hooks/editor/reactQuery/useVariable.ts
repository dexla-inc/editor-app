import { createVariable, updateVariable } from "@/requests/variables/mutations";
import { useAppStore } from "@/stores/app";
import { useMutation } from "@tanstack/react-query";

export const useVariableMutation = (projectId: string) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const queryKey = ["variables", projectId];

  const createVariablesMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: async (values: any) => {
      startLoading({
        id: "variable",
        title: "Saving",
        message: "Please wait",
      });
      return await createVariable(projectId, {
        ...values,
      });
    },
    onSuccess: () => {
      stopLoading({
        id: "variable",
        title: "Success",
        message: "Variable saved successfully",
      });
    },
    onError: (error: any) => {
      stopLoading({
        id: "variable",
        title: "Oops",
        message: error,
        isError: true,
      });
    },
  });

  const updateVariablesMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      startLoading({
        id: "variable",
        title: "Saving",
        message: "Please wait",
      });
      return await updateVariable(id, projectId, {
        ...values,
      });
    },
    ...{
      onSuccess: () => {
        stopLoading({
          id: "variable",
          title: "Success",
          message: "Variable saved successfully",
        });
      },
      onError: (error: any) => {
        stopLoading({
          id: "variable",
          title: "Oops",
          message: error,
          isError: true,
        });
      },
    },
  });

  return {
    createVariablesMutation,
    updateVariablesMutation,
  };
};
