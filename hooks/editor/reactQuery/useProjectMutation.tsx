import { deleteProject } from "@/requests/projects/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProjectMutatation = () => {
  const queryClient = useQueryClient();

  const queryKey = ["projects"];

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  const mutateResult = useMutation(deleteProject, {
    onSettled(_, err) {
      if (err) {
        console.error(err);
      }

      invalidate();
    },
  });

  return { ...mutateResult };
};
