import { VariableResponse } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { Select, SelectProps } from "@mantine/core";

type Props = Omit<SelectProps, "data"> & {
  onPick?: (variable: VariableResponse) => void;
  required?: boolean;
};

export const VariableSelect = ({ onPick, ...props }: Props) => {
  const variables = useVariableStore((state) => state.variableList);

  return (
    <Select
      size="xs"
      label="Variable"
      {...props}
      data={(variables ?? []).map((variable) => {
        return {
          value: variable.id,
          label: variable.name,
        };
      })}
      searchable
    />
  );
};
