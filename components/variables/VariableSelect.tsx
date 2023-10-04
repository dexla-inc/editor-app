import { listVariables } from "@/requests/variables/queries";
import { VariableResponse } from "@/requests/variables/types";
import { Select, SelectProps } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = Omit<SelectProps, "data"> & {
  onPick?: (variable: VariableResponse) => void;
};

export const VariableSelect = ({ onPick, ...props }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: variables } = useQuery({
    queryKey: ["variables", projectId, pageId],
    queryFn: async () => {
      return await listVariables(projectId, { pageId });
    },
    enabled: !!projectId && !!pageId,
  });

  return (
    <Select
      size="xs"
      label="Variable"
      {...props}
      data={(variables?.results ?? []).map((variable) => {
        return {
          value: variable.id,
          label: variable.name,
        };
      })}
      onChange={(varId) => {
        const variable = variables!.results.find((v) => v.id === varId)!;
        onPick?.(variable);
      }}
    />
  );
};
