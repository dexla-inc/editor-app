import { ComponentToBindFromInput } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
import { ChangeStateAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { BindingField } from "@/components/editor/BindingField/BindingField";

type Props = {
  form: UseFormReturnType<Omit<ChangeStateAction, "name">>;
  isPageAction?: boolean;
};

export const ChangeStateActionForm = ({ form, isPageAction }: Props) => {
  const { getComponentsStates } = useComponentStates();

  const componentStatesList = getComponentsStates();

  return (
    <Stack spacing="xs">
      <BindingField
        fieldType="Text"
        label="Component to change"
        isPageAction={isPageAction}
        {...form.getInputProps("componentId")}
      />
      {!!componentStatesList.length && (
        <BindingField
          fieldType="Select"
          label="State"
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          data={componentStatesList}
          {...form.getInputProps("state")}
        />
      )}
    </Stack>
  );
};
