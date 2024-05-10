import { FrontEndTypes, VariableResponse } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { MultiSelect, MultiSelectProps } from "@mantine/core";

type Props = Omit<MultiSelectProps, "data"> & {
  required?: boolean;
  setVariableType: (type: FrontEndTypes) => void;
};

export const VariableMultiSelect = ({ setVariableType, ...props }: Props) => {
  const variables = useVariableStore((state) =>
    Object.values(state.variableList),
  );
  const variableSelectData = (variables ?? []).map((variable) => {
    return {
      value: variable.id,
      label: variable.name ?? "",
      type: variable.type,
    };
  });

  const onSelectChange = (values: string[]) => {
    props.onChange?.(values);
  };

  return (
    <MultiSelect
      size="xs"
      label="Variables"
      {...props}
      data={variableSelectData}
      onChange={onSelectChange}
      searchable
      clearable
      nothingFound="No variables found"
    />
  );
};
