import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { VariableResponse } from "@/requests/variables/types";
import { Select, SelectProps } from "@mantine/core";
import { useRouter } from "next/router";

type Props = Omit<SelectProps, "data"> & {
  onPick?: (variable: VariableResponse) => void;
  required?: boolean;
};

export const VariableSelect = ({ onPick, ...props }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;

  const { data: variables } = useVariableListQuery(projectId);

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
    />
  );
};
