import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { VariableResponse } from "@/requests/variables/types";
import { Select, SelectProps } from "@mantine/core";

type Props = Omit<SelectProps, "data"> & {
  onPick?: (variable: VariableResponse) => void;
  required?: boolean;
};

export const VariableSelect = ({ onPick, ...props }: Props) => {
  const { data: variables } = useVariableListQuery({});

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
