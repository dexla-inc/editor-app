import { deleteProject } from "@/requests/projects/mutations";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

export const useProjectMutatation = () => {
  const queryKey = ["projects"];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const mutateResult = useMutation({
    mutationFn: deleteProject,
    ...{
      onSettled(_, err) {
        if (err) {
          console.error(err);
        }

        invalidate();
      },
    },
  });

  return { ...mutateResult };
};
