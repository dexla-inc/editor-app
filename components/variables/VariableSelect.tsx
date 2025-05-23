import { FrontEndTypes, VariableResponse } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { Select, SelectProps } from "@mantine/core";

type Props = Omit<SelectProps, "data"> & {
  required?: boolean;
  setVariableType: (type: FrontEndTypes) => void;
};

export const VariableSelect = ({ setVariableType, ...props }: Props) => {
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

  const onSelectChange = (value: string) => {
    const selectedItem = variableSelectData.find(
      (item) => item.value === value,
    );
    props.onChange?.(value);
    if (selectedItem) {
      setVariableType(selectedItem?.type);
    }
  };

  return (
    <Select
      size="xs"
      label="Variable"
      {...props}
      data={variableSelectData}
      onChange={onSelectChange}
      searchable
    />
  );
};
