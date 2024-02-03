import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { VariableResponse } from "@/requests/variables/types";
import { useEditorStore } from "@/stores/editor";
import { Select, SelectProps } from "@mantine/core";

type Props = Omit<SelectProps, "data"> & {
  onPick?: (variable: VariableResponse) => void;
  required?: boolean;
};

export const VariableSelect = ({ onPick, ...props }: Props) => {
  const projectId = useEditorStore((state) => state.currentProjectId) as string;

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
